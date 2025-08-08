// app/api/seed/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Providers from "@/model/Providers";
import {IProvider} from "@/model/Providers";
/**
 * NOTE:
 * - Place this file under your Next.js `app` folder (e.g. app/api/seed/route.ts).
 * - Call this endpoint once (e.g. open /api/seed in your browser or curl it).
 * - Remove or protect the route after seeding to avoid accidental re-seeds.
 */

interface RegionListItem {
  regionName: string;
  country: string;
  state?: string;
  city?: string;
  source?: string;
  comment?: string;
  providerName?: string;
  offsetRatio?: string;
  impact?: number;
}


interface ProviderRequest {
  providerName: string;
}

export async function GET() {
  try {
    await connectToDatabase();

    const providers = await Providers.find({}, {
      name: 1,
      providerName: 1,
      _id: 1,
    }); // find all providers
    return NextResponse.json(
      {
        providers
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 });
  }
}


export async function POST(request: Request ) {
  try {
    await connectToDatabase();

    const requestBody = await request.json();
    if (!requestBody || typeof requestBody !== "object") {
      return NextResponse.json(
        { error: "Invalid or missing JSON body." },
        { status: 400 }
      );
    }
    const regions: IProvider | null = await Providers.findOne({ name: 'gcp' });
    // console.log("Regions fetched:", regions?.regions);
    let regionList: Array<RegionListItem> = [];
    if (regions && regions.regions) {
      regionList = Array.from(regions.regions.values()).map(region => ({
        regionName: region.regionName ?? "",
        country: region.country ?? "",
        state: region.state,
        city: region.city,
        source: region.source,
        comment: region.comment,
        providerName: region.providerName,
        offsetRatio: region.offsetRatio,
        impact: region.impact
      }));
    }

    // Example seed data
    return NextResponse.json({ regions: regionList || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 });
  }
}