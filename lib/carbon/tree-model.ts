export type TreeModel = { kind: string; base?: number; trees?: {left_children:number[];right_children:number[];split_indices:number[];split_conditions:number[]}[]; model?: any; mean?: number[]; scale?: number[]; weights?: number[][][]; biases?: number[][]; coefficients?: number[]; intercept?: number };
// Numeric-only export. The same fixtures verify Python, ONNX, browser and server results.
export function runTreeModel(model: TreeModel, features: number[]): number {
  const input = Array.from(new Float32Array(features));
  if (input.some(v => !Number.isFinite(v))) throw new Error('Invalid vehicle features.');
  if (model.kind === 'xgboost') {
    let result = model.base!;
    for (const tree of model.trees!) {
      let node = 0;
      while (tree.left_children[node] !== -1) node = input[tree.split_indices[node]] < Math.fround(tree.split_conditions[node]) ? tree.left_children[node] : tree.right_children[node];
      result += Math.fround(tree.split_conditions[node]);
    }
    return result;
  }
  if (model.kind === 'catboost') {
    const source=model.model;
    let result=0;
    for (const tree of source.oblivious_trees) {
      let leaf=0;
      tree.splits.forEach((split: any,i:number) => { if (split.split_type !== 'FloatFeature') throw new Error('Unsupported categorical model.'); if(input[split.float_feature_index]>split.border) leaf|=1<<i; });
      result+=tree.leaf_values[leaf];
    }
    return result*source.scale_and_bias[0]+source.scale_and_bias[1][0];
  }
  let layer=input.map((value,i)=>(value-model.mean![i])/model.scale![i]);
  if(model.kind==='linear') return layer.reduce((sum,v,i)=>sum+v*model.coefficients![i],model.intercept!);
  if(model.kind!=='neural') throw new Error('Unsupported prediction model.');
  model.weights!.forEach((weights,index) => {
    layer=model.biases![index].map((bias,j)=>{const value=bias+layer.reduce((sum,x,i)=>sum+x*weights[i][j],0);return index<model.weights!.length-1?Math.max(0,value):value;});
  });
  return layer[0];
}
