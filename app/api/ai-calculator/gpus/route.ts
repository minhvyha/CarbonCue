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

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Gpus from "@/model/Gpus";

interface GpusResponse {
  gpus: string[];
}

interface ErrorResponse {
  error: string;
}

export async function GET(): Promise<
  ReturnType<typeof NextResponse.json<GpusResponse | ErrorResponse>>
> {
  const conn = await connectToDatabase();
  console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected
  try {

    const gpuDocs = await Gpus.find({}, "name").lean();
    const gpuNames = gpuDocs.map((gpu) => gpu.name); // extract only names
    return NextResponse.json({ gpus: gpuNames }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
