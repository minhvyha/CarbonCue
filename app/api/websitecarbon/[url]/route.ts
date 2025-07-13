export const dynamic = 'force-dynamic';

// app/api/resources/[slug]/route.ts

import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { url: string } }
) {

  const { url } = await params;
  console.log(`https://api.websitecarbon.com/site?url=${encodeURIComponent(url)}`)
  let request = await fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent(url)}`);
  
  if (!request.ok) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
  const data = await request.json();
  console.log('WebsiteCarbon data:', data);
  return NextResponse.json(data);

}
