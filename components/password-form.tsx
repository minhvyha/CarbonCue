'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
export function PasswordForm({reset=false}:{reset?:boolean}) {
  const [value,setValue]=useState(''),[message,setMessage]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  async function submit(event:React.FormEvent){
    event.preventDefault();setBusy(true);setError('');setMessage('');
    try{const response=await fetch(reset?'/api/auth/update-password':'/api/auth/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(reset?{password:value}:{email:value})});const data=await response.json();if(!response.ok)throw new Error(data.error);setMessage(data.message);setValue('');}
    catch(error){setError(error instanceof Error?error.message:'Please try again.');}finally{setBusy(false);}
  }
  return <form onSubmit={submit} className="mx-auto max-w-md space-y-5 px-4 py-12"><h1 className="text-3xl font-bold">{reset?'Set a new password':'Reset your password'}</h1><Label htmlFor="reset-value">{reset?'New password':'Email'}</Label><Input id="reset-value" type={reset?'password':'email'} minLength={reset?8:undefined} autoComplete={reset?'new-password':'email'} value={value} onChange={e=>setValue(e.target.value)} required/><Button disabled={busy} type="submit">{busy?'Please wait...':reset?'Update password':'Send reset link'}</Button>{error&&<p role="alert" className="text-destructive">{error}</p>}{message&&<p role="status">{message}</p>}<p><Link href="/login" className="underline">Back to sign in</Link></p></form>;
}
