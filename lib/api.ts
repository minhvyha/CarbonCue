import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
export class ApiError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message || 'Invalid input.' }, { status: 400 });
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error('API request failed:', error);
  return NextResponse.json({ error: 'This service is temporarily unavailable. Please try again.' }, { status: 503 });
}
