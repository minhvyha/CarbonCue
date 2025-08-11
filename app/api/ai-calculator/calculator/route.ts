/**
 * API: Calculate CO2 Emission for GPU Usage
 * -----------------------------------------
 * Endpoint:    POST /ai-calculator/calculator
 * Purpose:     Calculate energy consumption, CO2 emission, and offset based on GPU usage and cloud provider/location or custom emission factors.
 * Method:      POST
 * Request Body (JSON):
 *   - Case 1: Use provider/region emission factors
 *       {
 *         "gpu": "AGX Xavier",
 *         "provider": "gcp",
 *         "region": "asia-east1",
 *         "hours": 100,
 *         "customImpact": null,
 *         "customOffset": null
 *       }
 *   - Case 2: Use custom emission factors
 *       {
 *         "gpu": "AGX Xavier",
 *         "provider": null,
 *         "region": null,
 *         "hours": 100,
 *         "customImpact": 0.5,
 *         "customOffset": 50
 *       }
 *   - Only one of the two cases above is valid per request.
 * Response:
 *   - 200 OK:
 *       {
 *         "energy": number,         // Power consumption (kWh)
 *         "impact": number,         // Emission factor (kg/kWh)
 *         "co2": number,            // CO2 emission (kg)
 *         "offset": number,         // CO2 offset (kg)
 *         "offsetPercents": number  // Offset ratio (%)
 *       }
 *   - 400 Bad Request:
 *       {
 *         "error": "Error message"
 *       }
 * Example curl:
 *   curl -X POST http://localhost:3000/api/ai-calculator/calculator \
 *     -H "Content-Type: application/json" \
 *     -d '{"gpu":"AGX Xavier","provider":"gcp","region":"asia-east1","hours":100,"customImpact":null,"customOffset":null}'
 */

import { NextResponse } from 'next/server';
import calculateCO2 from './calculator';



interface CalculatorRequest {
    gpu: string;
    provider: string | null;
    region: string | null;
    hours: number;
    customImpact: number | null;
    customOffset: number | null;
}

interface CalculatorResponse {
    energy: number;
    impact: number;
    co2: number;
    offset: number;
    offsetPercents: number;
}

interface ErrorResponse {
    error: string;
}

export async function POST(
    request: Request
): Promise<ReturnType<typeof NextResponse.json<CalculatorResponse | ErrorResponse>>> {
    try {
        const values: CalculatorRequest = await request.json();

        if (values == null || typeof values !== 'object') {
            return NextResponse.json({ error: 'Invalid or missing JSON body.' }, { status: 400 });
        }
        const { provider, region, customImpact, customOffset } = values;

        const isCustomNull = customImpact == null && customOffset == null;
        const isProviderNull = provider == null && region == null;
        const isCustomValid = Number.isFinite(customImpact) && Number.isFinite(customOffset);
        const isProviderValid = typeof provider === 'string' && typeof region === 'string';

        // Only valid if:
        // 1. customImpact and customOffset are both null, provider and region must be valid
        // 2. provider and region are both null, customImpact and customOffset must be numbers

        let result: CalculatorResponse;
        try {
            result = await calculateCO2(values);
            console.log("Calculation result:", result);
        } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}