/**
 * API: Cloud Providers Information
 * --------------------------------
 * Endpoint:
 *   - GET  /ai-calculator/providers
 *       → Returns a list of all available cloud providers with their display names.
 *   - POST /ai-calculator/providers
 *       → Returns a list of locations/regions for a specific provider.
 *
 * GET:
 *   - No parameters required.
 *   - Response 200 OK:
 *       {
 *         "providers": [
 *           { "value": "gcp", "providerName": "Google Cloud Platform" },
 *           { "value": "aws", "providerName": "Amazon Web Services" },
 *           ...
 *         ]
 *       }
 *   - Response 500 Internal Server Error:
 *       { "error": "Error message" }
 *
 * POST:
 *   - Request body (JSON):
 *       { "providerName": "gcp" }
 *   - Response 200 OK:
 *       { "locations": ["asia-east1", "us-central1", ...] }
 *   - Response 400 Bad Request:
 *       { "error": "Invalid or missing JSON body." }
 *       { "error": "Invalid input: Must provide valid provider name" }
 *   - Response 404 Not Found:
 *       { "error": "Provider not found" }
 *
 * Example curl for GET:
 *   curl http://localhost:3000/api/ai-calculator/providers
 *
 * Example curl for POST:
 *   curl -X POST http://localhost:3000/api/ai-calculator/providers \
 *     -H "Content-Type: application/json" \
 *     -d '{"providerName":"gcp"}'
 */

import { NextResponse } from 'next/server';
import { getProviders, getJSON } from './getProviders';

interface ProviderInfo {
    value: string;
    providerName: string;
}

interface ProvidersResponse {
    providers: ProviderInfo[];
}

interface LocationsResponse {
    locations: string[];
}

interface ErrorResponse {
    error: string;
}

interface ProviderRequest {
    providerName: string;
}

const providers: ProviderInfo[] = getProviders();
const data = getJSON("../data.json");

export function GET(): NextResponse<ProvidersResponse | ErrorResponse> {
    try {
        return NextResponse.json({ providers: providers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request): Promise<NextResponse<LocationsResponse | ErrorResponse>> {
    try {
        const values: ProviderRequest = await request.json();

        if (values == null || typeof values !== 'object') {
            return NextResponse.json({ error: 'Invalid or missing JSON body.' }, { status: 400 });
        }

        const { providerName } = values;
        if (!providerName || typeof providerName !== "string") {
            return NextResponse.json({ error: 'Invalid input: Must provide valid provider name' }, { status: 400 });
        }

        const provider = data.providers[providerName];
        if (!provider) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        const locations = Object.keys(provider).filter(key => !key.startsWith('__'));
        return NextResponse.json({ locations }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}