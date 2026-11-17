'use client';
import type { ActivityInput, Prediction } from './schema';
let worker: Worker | undefined;
let nextId=0;
const pending=new Map<number,{resolve:(prediction:Prediction)=>void;reject:(error:Error)=>void;timer:ReturnType<typeof setTimeout>}>();
export function predictInBrowser(activity: ActivityInput): Promise<Prediction> {
  if(!worker) {
    worker=new Worker(new URL('../../workers/carbon-predictor.worker.ts',import.meta.url),{type:'module'});
    worker.onmessage=event=>{const item=pending.get(event.data.id);if(!item)return;clearTimeout(item.timer);pending.delete(event.data.id);if(event.data.error)item.reject(new Error(event.data.error));else item.resolve(event.data.result);};
    worker.onerror=()=>{for(const item of pending.values()){clearTimeout(item.timer);item.reject(new Error('The local prediction worker failed. Reload the page.'));}pending.clear();worker?.terminate();worker=undefined;};
  }
  return new Promise((resolve,reject)=>{const id=++nextId;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('The local model took too long to load. Try again.'));},30000);pending.set(id,{resolve,reject,timer});worker!.postMessage({id,activity});});
}
