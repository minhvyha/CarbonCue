"""Reproducible specification-based vehicle tailpipe CO2 estimation, not a lifecycle model."""
import hashlib, json, time, urllib.request
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.model_selection import GroupShuffleSplit
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from catboost import CatBoostRegressor
from xgboost import XGBRegressor
import onnxruntime as ort

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://www.fueleconomy.gov/feg/epadata/vehicles.csv.zip'
archive = ROOT / 'ml/data/vehicles.csv.zip'
archive.parent.mkdir(parents=True, exist_ok=True)
if not archive.exists(): urllib.request.urlretrieve(SOURCE, archive)
df = pd.read_csv(archive, low_memory=False)
df = df[(df.co2 > 0) & df.year.between(2013, 2026) & df.fuelType1.isin(['Regular Gasoline', 'Premium Gasoline', 'Midgrade Gasoline', 'Diesel']) & (df.atvType.fillna('') != 'Plug-in Hybrid')].dropna(subset=['displ', 'cylinders', 'drive', 'trany']).copy()
df = df.drop_duplicates(subset=['year','make','model','displ','cylinders','fuelType1','drive','trany','co2'])
vehicle_class = np.select([df.VClass.str.contains('Sport Utility', case=False), df.VClass.str.contains('Pickup', case=False), df.VClass.str.contains('Van', case=False)], [1,2,3], default=0)
features = ['year','engineLitres','cylinders','diesel','hybrid','awd','automatic','suv','truck','van']
X = np.column_stack([df.year, df.displ, df.cylinders, df.fuelType1.eq('Diesel'), df.atvType.eq('Hybrid'), df.drive.str.contains('4-Wheel|All-Wheel|4WD'), ~df.trany.str.startswith('Manual'), vehicle_class==1,vehicle_class==2,vehicle_class==3]).astype(np.float32)
y = df.co2.to_numpy(dtype=float) / 1.609344
# Keep every year and trim of a make/model family in the same partition.
groups = (df.make.str.lower() + '/' + df.model.str.lower().str.split().str[0]).to_numpy()
split = GroupShuffleSplit(n_splits=1, test_size=.2, random_state=42)
train_cal, test = next(split.split(X,y,groups))
train_val_i, calibration_i = next(GroupShuffleSplit(n_splits=1, test_size=.1875, random_state=43).split(X[train_cal],y[train_cal],groups[train_cal]))
train_val, calibration = train_cal[train_val_i], train_cal[calibration_i]
train_i, val_i = next(GroupShuffleSplit(n_splits=1, test_size=.23, random_state=44).split(X[train_val],y[train_val],groups[train_val]))
train, val = train_val[train_i], train_val[val_i]
partitions=[set(groups[index]) for index in [train,val,calibration,test]]
for i,a in enumerate(partitions):
 for b in partitions[i+1:]: assert not a.intersection(b)
models = {
 'fuel_median': DummyRegressor(strategy='median'),
 'linear': make_pipeline(StandardScaler(),Ridge(alpha=10)),
 'xgboost': XGBRegressor(n_estimators=450,max_depth=5,learning_rate=.045,subsample=.85,colsample_bytree=.9,reg_lambda=10,n_jobs=2,random_state=42),
 'catboost': CatBoostRegressor(iterations=650,depth=6,learning_rate=.045,loss_function='RMSE',random_seed=42,verbose=False,thread_count=2,allow_writing_files=False),
 'neural': make_pipeline(StandardScaler(),MLPRegressor(hidden_layer_sizes=(48,24),max_iter=450,early_stopping=True,random_state=42)),
}
validation = {}
for name, model in models.items():
 start=time.time(); model.fit(X[train],y[train]); pred=model.predict(X[val]);
 validation[name]={'mae_g_per_km':float(mean_absolute_error(y[val],pred)), 'rmse_g_per_km':float(np.sqrt(mean_squared_error(y[val],pred))), 'training_seconds':round(time.time()-start,3)}
 print(name,validation[name],flush=True)
# Use validation only to select the model; final test results are reported once.
winner = min(['xgboost','catboost','neural'],key=lambda n:validation[n]['mae_g_per_km'])
if validation[winner]['mae_g_per_km'] >= validation['linear']['mae_g_per_km']: winner='linear'
model=models[winner]
# Calibration uses groups unseen during fitting and model selection.
residual = np.abs(y[calibration]-model.predict(X[calibration]))
q = float(np.quantile(residual,min(1,np.ceil((len(calibration)+1)*.9)/len(calibration)),method='higher'))
pred=model.predict(X[test]);test_mae=float(mean_absolute_error(y[test],pred))
coverage=float(np.mean(np.abs(y[test]-pred)<=q))
output=ROOT/'public/models';output.mkdir(exist_ok=True)
path=output/'vehicle-v1.onnx'
if winner=='catboost': model.save_model(str(path),format='onnx')
elif winner=='xgboost':
 from onnxmltools import convert_xgboost
 from onnxmltools.convert.common.data_types import FloatTensorType
 onnx_model=convert_xgboost(model,initial_types=[('features',FloatTensorType([None,len(features)]))],target_opset=15)
 path.write_bytes(onnx_model.SerializeToString())
else:
 from skl2onnx import convert_sklearn
 from skl2onnx.common.data_types import FloatTensorType
 onnx_model=convert_sklearn(model,initial_types=[('features',FloatTensorType([None,len(features)]))],target_opset=15)
 path.write_bytes(onnx_model.SerializeToString())
session=ort.InferenceSession(str(path),providers=['CPUExecutionProvider'])
fixture=X[test[:100]].astype(np.float32)
export_pred=np.asarray(session.run(None,{session.get_inputs()[0].name:fixture})[0]).reshape(-1)
parity=float(np.max(np.abs(export_pred-model.predict(fixture))))
if parity > .01: raise RuntimeError(f'Export parity failed: {parity}')
if winner == 'xgboost':
 raw=json.loads(model.get_booster().save_raw(raw_format='json'))
 runtime={'kind':'xgboost','base':float(raw['learner']['learner_model_param']['base_score']), 'trees':[{k:tree[k] for k in ['left_children','right_children','split_indices','split_conditions']} for tree in raw['learner']['gradient_booster']['model']['trees']]}
elif winner == 'catboost':
 import tempfile
 with tempfile.NamedTemporaryFile(suffix='.json') as file:
  model.save_model(file.name,format='json');runtime={'kind':'catboost','model':json.loads(Path(file.name).read_text())}
else:
 scale=model.steps[0][1];regressor=model.steps[-1][1]
 runtime={'kind':'neural' if winner=='neural' else 'linear','mean':scale.mean_.tolist(),'scale':scale.scale_.tolist()}
 if winner=='neural': runtime.update({'weights':[v.tolist() for v in regressor.coefs_],'biases':[v.tolist() for v in regressor.intercepts_]})
 else: runtime.update({'coefficients':regressor.coef_.tolist(),'intercept':float(regressor.intercept_)})
runtime_path=output/'vehicle-runtime.json'
runtime_path.write_text(json.dumps(runtime,separators=(',',':'))+'\n')
manifest={'version':'epa-vehicle-v1','selected_model':winner,'path':'/models/vehicle-v1.onnx','features':features,'output_unit':'g CO2 per km','boundary':'Tailpipe CO2 only; excludes upstream fuel, vehicle manufacturing, and non-CO2 greenhouse gases.','population':'US EPA certification records for model years 2013-2026; Australian on-road performance may differ.','source':SOURCE,'dataset_sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'model_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'model_bytes':path.stat().st_size,'runtime_path':'/models/vehicle-runtime.json','runtime_bytes':runtime_path.stat().st_size,'runtime_sha256':hashlib.sha256(runtime_path.read_bytes()).hexdigest(),'rows':len(df),'test_baselines':{name:{'mae_g_per_km':float(mean_absolute_error(y[test],candidate.predict(X[test]))),'rmse_g_per_km':float(np.sqrt(mean_squared_error(y[test],candidate.predict(X[test]))))} for name,candidate in models.items()},'split':{'train':len(train),'validation':len(val),'calibration':len(calibration),'test':len(test),'group':'make + model family; fixed seeds 42/43/44'},'validation':validation,'test':{'mae_g_per_km':test_mae,'rmse_g_per_km':float(np.sqrt(mean_squared_error(y[test],pred))),'bias_g_per_km':float(np.mean(pred-y[test])),'interval_half_width_g_per_km':q,'empirical_interval_coverage':coverage,'nominal_interval_coverage':.9},'native_export_max_abs_error':parity,'ranges':{'year':[int(df.year.min()),int(df.year.max())],'engineLitres':[float(df.displ.min()),float(df.displ.max())],'cylinders':[int(df.cylinders.min()),int(df.cylinders.max())]},'limitations':['Certification-based estimates are not measurements of a user driving their vehicle.','Calibration groups are separate; intervals assume exchangeability and may not cover Australian or out-of-domain driving.','No synthetic lifestyle footprint labels are used.','TabPFN was not included: deployment of that runtime was not established for this browser target.']}
(output/'vehicle-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(output/'vehicle-fixtures.json').write_text(json.dumps({'features':fixture[:12].tolist(),'expected':export_pred[:12].tolist()}))
print('SELECTED',winner,'TEST',manifest['test'],'BYTES',path.stat().st_size,'PARITY',parity,flush=True)
