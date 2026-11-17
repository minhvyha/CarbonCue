import { predictActivity, requiresModel, manifest } from '@/lib/carbon/predict';
import type { ActivityInput } from '@/lib/carbon/schema';
import type { TreeModel } from '@/lib/carbon/tree-model';
let modelPromise: Promise<TreeModel> | undefined;
async function loadModel() {
  if (!modelPromise) modelPromise=(async () => {
    const cache=typeof caches==='undefined'?null:await caches.open(manifest.version).catch(()=>null);
    let response=cache?await cache.match(manifest.runtime_path):undefined;
    if(!response) {
      response=await fetch(manifest.runtime_path);
      if(!response.ok) throw new Error('Could not load the prediction model.');
    }
    const bytes=await response.arrayBuffer();
    const digest=await crypto.subtle.digest('SHA-256',bytes);
    const hash=Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,'0')).join('');
    if(hash!==manifest.runtime_sha256) { await cache?.delete(manifest.runtime_path); throw new Error('Prediction model integrity check failed. Reload the page.'); }
    await cache?.put(manifest.runtime_path,new Response(bytes,{headers:{'Content-Type':'application/json'}})).catch(()=>{});
    return JSON.parse(new TextDecoder().decode(bytes)) as TreeModel;
  })().catch(error=>{modelPromise=undefined;throw error;});
  return modelPromise;
}
self.onmessage=async (event: MessageEvent<{id:number;activity:ActivityInput}>) => {
  const { id, activity }=event.data;
  const start=performance.now();
  try {
    const model=requiresModel(activity)?await loadModel():undefined;
    self.postMessage({id,result:predictActivity(activity,model),inferenceMs:performance.now()-start});
  } catch(error) { self.postMessage({id,error:error instanceof Error?error.message:'Prediction failed.'}); }
};
