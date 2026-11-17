"""Build the bundled source snapshot. Run with openpyxl installed."""
import csv, hashlib, json, urllib.request
from pathlib import Path
import openpyxl
ROOT=Path(__file__).resolve().parents[1]
nga=Path('/tmp/carboncue-nga2026.xlsx');food=Path('/tmp/carboncue-food.csv')
if not nga.exists(): urllib.request.urlretrieve('https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-accounts-factors-2026.xlsx',nga)
if not food.exists(): urllib.request.urlretrieve('https://ourworldindata.org/grapher/food-emissions-supply-chain.csv',food)
w=openpyxl.load_workbook(nga,read_only=True,data_only=True)
rows=[list(r) for r in w['Table 1'].values]
region_codes=['NSW','VIC','QLD','SA','WA-SWIS','WA-NWIS','TAS','NT','AU']
electricity={}
for code,row in zip(region_codes,rows[3:12]):
 values=[v for v in row if v is not None]
 electricity[code]={'label':values[0].strip(),'kgPerKwh':values[1]+values[2],'scope2':values[1],'scope3':values[2]}
# ACT uses the NSW/ACT location-based factor. This is not a market-based renewable claim.
electricity['ACT']={**electricity['NSW'],'label':'Australian Capital Territory (location-based)'}
foods={}
for row in csv.DictReader(food.open()):
 foods[row['Entity']]={'kgPerKg':round(sum(float(v) for k,v in row.items() if k not in ['Entity','Year']),6),'year':int(row['Year'])}
factors={'version':'carboncue-factors-2026-v1','electricity':electricity,'fuel':{'petrol':{'kgPerLitre':34.2*67.62/1000,'upstreamKgPerLitre':34.2*17.2/1000},'diesel':{'kgPerLitre':38.6*70.41/1000,'upstreamKgPerLitre':38.6*17.3/1000}},'naturalGasKgPerMj':51.53/1000,'landfillKgPerKg':1.5,'foods':foods,'sources':[{'name':'DCCEEW National Greenhouse Accounts Factors 2026','url':'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2026','tables':['1','5','9','16'],'sha256':hashlib.sha256(nga.read_bytes()).hexdigest(),'licence':'CC BY 4.0, Commonwealth of Australia; see workbook terms'},{'name':'Poore and Nemecek (2018), processed by Our World in Data','url':'https://ourworldindata.org/grapher/food-emissions-supply-chain','sha256':hashlib.sha256(food.read_bytes()).hexdigest(),'licence':'CC BY, original data attribution retained'}]}
(ROOT/'data/emission-factors.json').write_text(json.dumps(factors,indent=2)+'\n')
print('Factors prepared',len(electricity),'electricity regions',len(foods),'foods')
