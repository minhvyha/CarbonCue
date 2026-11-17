# CarbonCue vehicle model, epa-vehicle-v1

This release estimates tailpipe CO2 in g/km from vehicle specifications. It is not a full personal carbon model or a lifecycle vehicle model.

Source: US EPA / Department of Energy, [FuelEconomy.gov vehicle data](https://www.fueleconomy.gov/feg/ws/index.shtml). The exact archive checksum, eligible record count, split sizes, hyperparameters in training code, and evaluation are recorded in `public/models/vehicle-manifest.json`. Exclude missing/nonpositive CO2 targets, incomplete engine specifications, electric vehicles, plug-in hybrids, unsupported fuels, and model years outside 2013-2026. The target is the published certification CO2 field, not an observation of the user's driving.

Model selection compares a median baseline, scaled linear regression, XGBoost, CatBoost, and a compact neural regressor. Four disjoint make/model-family group partitions are used: training, validation, interval calibration, and untouched test. Validation MAE selects XGBoost. TabPFN was not benchmarked because its browser deployment/runtime was not established; this release makes no claim of being universally the best model.

The selected model's held-out MAE is approximately 20.1 g CO2/km, RMSE 26.3 g/km. Its nominal 90% split-conformal reference interval achieved 87.0% empirical coverage on held-out groups. US certification data and exchangeability assumptions limit applicability to Australian on-road use. See the manifest for all benchmark results and limitations.

The release includes ONNX and a compact numeric tree export. Native Python, ONNX CPU, ONNX WebAssembly, and the JavaScript tree evaluator are checked against the same fixtures. Browser inference uses the compact tree export in a Web Worker: it avoids shipping a large WebAssembly runtime to perform small tree predictions. The model file's SHA-256 is checked before execution. The server recomputes saved estimates using the same tree evaluator, instead of trusting browser numbers.

User-supplied measured fuel consumption uses Australian NGA factors instead of the learned model. Its boundary includes upstream fuel emissions, while the ML boundary includes tailpipe CO2 only. Those outputs must not be treated as equivalent lifecycle measures.

All non-vehicle categories use sourced factor calculations, with method and boundary shown to users. No synthetic lifestyle labels, invented per-category models, or advertised model confidence percentages are used.

## Reproduce

Create a Python environment and install `ml/requirements.txt`. On macOS, XGBoost also needs an OpenMP runtime; the implementation run used the runtime bundled with scikit-learn through `DYLD_LIBRARY_PATH`, without changing system libraries.

Run `python ml/train_vehicle.py`. It downloads the official archive if absent. Dataset updates may change the result; retain the manifest checksum to identify a release. Training does not run at website startup.

Run `npm test` for unit conversion, validation, model fixture parity, and ONNX WebAssembly agreement. `public/models/vehicle-v1.onnx` is the portable reference artifact. Browser runtime weights are in `public/models/vehicle-runtime.json`.
