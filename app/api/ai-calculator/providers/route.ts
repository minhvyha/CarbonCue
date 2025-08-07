import { NextResponse } from "next/server";
import { getProviders, getJSON } from "./getProviders";

// --- Define the shape of a region object ---
interface Region {
  regionName: string;
  offsetRatio: string;
  impact: number;
}

interface ProviderInfo {
  value: string;
  providerName: string;
}

interface ProvidersResponse {
  providers: ProviderInfo[];
}

// Updated response type to return list of regions
interface RegionsResponse {
  regions: Region[];
}

interface ErrorResponse {
  error: string;
}

interface ProviderRequest {
  providerName: string;
}

// Load static provider list and JSON data
const providers: ProviderInfo[] = getProviders();
const data = getJSON("../data.json");

export function GET(): NextResponse<ProvidersResponse | ErrorResponse> {
  try {
    return NextResponse.json({ providers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<RegionsResponse | ErrorResponse>> {
  try {
    const values: ProviderRequest = await request.json();

    if (!values || typeof values !== "object") {
      return NextResponse.json(
        { error: "Invalid or missing JSON body." },
        { status: 400 }
      );
    }

    const { providerName } = values;
    if (!providerName || typeof providerName !== "string") {
      return NextResponse.json(
        { error: "Invalid input: Must provide valid provider name" },
        { status: 400 }
      );
    }

    const provider = data.providers[providerName];
    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Transform provider's location data into Region objects
    const regions: Region[] = Object.entries(provider)
      .filter(([key]) => !key.startsWith("__"))
      .map(([regionName, info]: [string, any]) => ({
        regionName,
        offsetRatio: String(info.offsetRatio ?? "1"),
        impact: Number(info.impact ?? 0),
      }));

    return NextResponse.json({ regions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
