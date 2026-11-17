'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/toast-provider';
import { useActivity } from '@/contexts/activity-context';
import { useAuth } from '@/contexts/auth-context';
import { predictInBrowser } from '@/lib/carbon/browser-predictor';
import { activitySchema, type ActivityInput, type Prediction } from '@/lib/carbon/schema';
import { factors } from '@/lib/carbon/calculate';
import { manifest } from '@/lib/carbon/predict';

const style='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
const baseInput={ activityType:'transportation',mode:'car',distanceKm:10,fuel:'petrol',year:2020,engineLitres:2,cylinders:4,awd:false,automatic:true,vehicleClass:'car',occupancy:1,kwhPer100Km:18 };
const defaults: Record<string,Record<string,any>>={transportation:baseInput,home_energy:{activityType:'home_energy',electricityKwh:10,gasMj:0,householdShare:1},food_diet:{activityType:'food_diet',food:'Poultry Meat',quantityKg:.2},shopping:{activityType:'shopping',kind:'landfill',quantity:1,productKgCo2e:0,productSource:''},digital_usage:{activityType:'digital_usage',hours:2,watts:50}};
function today() { return new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
export function CarbonTrackerForm() {
  const [input,setInput]=useState<Record<string,any>>({...baseInput});
  const [date,setDate]=useState(today);
  const [region,setRegion]=useState('NSW');
  const [notes,setNotes]=useState('');
  const [result,setResult]=useState<Prediction|null>(null);
  const [busy,setBusy]=useState(false);
  const [saved,setSaved]=useState(false);
  const [error,setError]=useState('');
  const {user}=useAuth();const {refreshActivityLogs}=useActivity();const {toast}=useToast();
  function change(key:string,value:any){setInput(old=>({...old,[key]:value}));setResult(null);setSaved(false);setError('');}
  function number(key:string,label:string,min=0,max=10000,step='any'){
    return <div className="grid gap-2"><Label htmlFor={key}>{label}</Label><Input id={key} type="number" value={input[key] ?? ''} min={min} max={max} step={step} required={key!=='litresPer100Km'} onChange={e=>change(key,e.target.value===''?undefined:Number(e.target.value))}/></div>;
  }
  function select(key:string,label:string,options:Record<string,string>){return <div className="grid gap-2"><Label htmlFor={key}>{label}</Label><select id={key} className={style} value={input[key]} onChange={e=>change(key,e.target.value)}>{Object.entries(options).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></div>;}
  function activity(){return activitySchema.parse({input,activityDate:date,region,notes,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone});}
  async function estimate(event:React.FormEvent){
    event.preventDefault();setBusy(true);setSaved(false);setError('');
    try{setResult(await predictInBrowser(activity()));}
    catch(error){setResult(null);setError(error instanceof Error?error.message:'Could not calculate.');}
    finally{setBusy(false);}
  }
  async function save(){
    setBusy(true);setError('');
    try{
      const response=await fetch('/api/activity-tracker',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(activity())});
      const data=await response.json();if(!response.ok)throw new Error(data.error||'Could not save.');
      setResult(data.prediction);setSaved(true);await refreshActivityLogs();toast({title:'Activity saved',description:'Your daily and monthly totals have been updated.'});
    }catch(error){setError(error instanceof Error?error.message:'Could not save.');}
    finally{setBusy(false);}
  }
  return <form onSubmit={estimate} className="space-y-4">
    <p className="text-sm text-muted-foreground">Enter quantities for the selected day. Estimates run on your device. Sign in to save them.</p>
    <div className="grid gap-2"><Label htmlFor="activity-type">Activity Type</Label><select id="activity-type" disabled={busy} className={style} value={input.activityType} onChange={e=>{setInput({...defaults[e.target.value]});setResult(null);setSaved(false);setError('');}}>{Object.entries({transportation:'Transportation',home_energy:'Home energy',food_diet:'Food',shopping:'Shopping & waste',digital_usage:'Digital device'}).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
    <fieldset disabled={busy} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {input.activityType==='transportation'&&<>
        {select('mode','Travel mode',{car:'Petrol / diesel / hybrid car',electric_car:'Electric car',walk_bicycle:'Walk / bicycle'})}
        {number('distanceKm','Distance for this day (km)',0,20000)}
        {input.mode!=='walk_bicycle'&&number('occupancy','People sharing the trip',1,20,'1')}
        {input.mode==='electric_car'&&number('kwhPer100Km','Electricity consumption (kWh / 100 km)',.1,100)}
        {input.mode==='car'&&<>
          {select('fuel','Fuel / powertrain',{petrol:'Petrol',diesel:'Diesel',hybrid:'Petrol hybrid'})}
          {number('litresPer100Km','Measured fuel consumption, if known (L / 100 km)',.1,80)}
          {input.litresPer100Km===undefined&&<>
            <p className="text-xs text-muted-foreground md:col-span-2">Without measured consumption, a local model estimates tailpipe CO₂ from these vehicle specifications.</p>
            {number('year','Model year',2013,2026,'1')}{number('engineLitres','Engine size (litres)',.6,8.4)}{number('cylinders','Cylinders',2,16,'1')}
            {select('vehicleClass','Vehicle class',{car:'Passenger car',suv:'SUV',truck:'Pickup',van:'Van'})}
            <label className="flex items-center gap-2"><input type="checkbox" checked={input.awd} onChange={e=>change('awd',e.target.checked)}/>All-wheel / four-wheel drive</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={input.automatic} onChange={e=>change('automatic',e.target.checked)}/>Automatic transmission</label>
          </>}
        </>}
      </>}
      {input.activityType==='home_energy'&&<>{number('electricityKwh','Electricity for this day (kWh)')}{number('gasMj','Natural gas for this day (MJ)',0,100000)}{number('householdShare','Your share of household use (0 to 1)',.01,1)}</>}
      {input.activityType==='food_diet'&&<>{select('food','Food product',Object.fromEntries(Object.keys(factors.foods).sort().map(v=>[v,v])))}{number('quantityKg','Food consumed / purchased (kg)',0,100)}</>}
      {input.activityType==='shopping'&&<>{select('kind','Activity',{landfill:'Municipal waste sent to landfill',product:'Product with a published footprint'})}{number('quantity',input.kind==='landfill'?'Waste mass (kg)':'Number of products',0,10000)}{input.kind==='product'&&<>{number('productKgCo2e','Published footprint per product (kg CO₂e)',.001,100000)}<div className="grid gap-2"><Label htmlFor="productSource">Footprint source</Label><Input id="productSource" value={input.productSource} required onChange={e=>change('productSource',e.target.value)} placeholder="Product report or source URL"/></div></>}</>}
      {input.activityType==='digital_usage'&&<>{number('hours','Hours used this day',0,24)}{number('watts','Device power (watts)',0,10000)}<p className="text-xs text-muted-foreground">50 W is an editable example. Use a measured value or your device specification.</p></>}
      <div className="grid gap-2"><Label htmlFor="region">Electricity region</Label><select id="region" value={region} className={style} onChange={e=>{setRegion(e.target.value);setResult(null);}}>{Object.entries(factors.electricity).map(([v,r])=><option key={v} value={v}>{r.label}</option>)}</select></div>
      <div className="grid gap-2"><Label htmlFor="activity-date">Activity date</Label><Input id="activity-date" type="date" value={date} onChange={e=>{setDate(e.target.value);setResult(null);}} required/></div>
      <div className="grid gap-2"><Label htmlFor="activity-notes">Notes (optional)</Label><Input id="activity-notes" value={notes} maxLength={2000} onChange={e=>setNotes(e.target.value)}/></div>
      <Button type="submit" className="w-full bg-carbon-red hover:bg-carbon-deep-red">{busy?'Calculating...':'Estimate emissions'}</Button>
    </fieldset>
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
    {result&&<div aria-live="polite" className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-medium">{result.method==='ml'?'Local ML estimate':'Factor calculation'}</p>
      <p className="text-2xl font-bold">{result.kgCo2e.toFixed(3)} kg CO₂e</p>
      <p className="text-sm">{result.summary}</p>
      {result.intervalKg&&<p className="text-sm">Reference interval: {result.intervalKg[0].toFixed(3)} to {result.intervalKg[1].toFixed(3)} kg</p>}
      <p className="text-xs text-muted-foreground">{result.boundary}</p>
      {result.warnings.map(w=><p key={w} className="text-xs text-muted-foreground">{w}</p>)}
      <p className="text-xs text-muted-foreground">{result.modelVersion||result.factorVersion}. <Link href="/methodology" className="underline">Sources and model evaluation</Link></p>
      {user?<Button type="button" className="w-full" disabled={busy||saved} onClick={save}>{saved?'Saved':busy?'Saving...':'Save activity'}</Button>:<Link href="/login" className="underline text-sm">Sign in to save this estimate</Link>}
    </div>}
  </form>;
}
