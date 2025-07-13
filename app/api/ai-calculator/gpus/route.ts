/**
 * API: Get available GPU names
 * ----------------------------
 * Endpoint:    GET /ai-calculator/gpus
 * Purpose:     Returns a list of available GPU names for calculation.
 * Method:      GET
 * Request:     No parameters or body required.
 * Response:
 *   - 200 OK:
 *       {
 *         "gpus": ["A100 PCIe 40/80GB", "A100 SXM4 80 GB", ...]
 *       }
 *   - 500 Internal Server Error:
 *       {
 *         "error": "Detailed error message"
 *       }
 * Example curl:
 *   curl http://localhost:3000/api/ai-calculator/gpus
 */

import { NextResponse } from 'next/server';
import getGPUS from './getGPUS';

interface GpusResponse {
    gpus: string[];
}

interface ErrorResponse {
    error: string;
}

export function GET(): ReturnType<typeof NextResponse.json<GpusResponse | ErrorResponse>> {
    try {
        const gpus = getGPUS();
        return NextResponse.json({ gpus }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


