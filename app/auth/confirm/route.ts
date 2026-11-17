import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function GET(request: Request) {
  const url=new URL(request.url);
  const next=url.searchParams.get('next') || '/carbon-tracker';
  const target=next.startsWith('/')&&!next.startsWith('//')&&!next.includes('\\')?next:'/carbon-tracker';
  const supabase=await createClient();
  const code=url.searchParams.get('code'), token=url.searchParams.get('token_hash'), type=url.searchParams.get('type');
  const result=code?await supabase.auth.exchangeCodeForSession(code):token&&(type==='email'||type==='signup'||type==='recovery')?await supabase.auth.verifyOtp({token_hash:token,type}):{error:new Error('Missing confirmation token.')};
  return NextResponse.redirect(new URL(result.error?'/login?error=confirmation':target,url.origin));
}
