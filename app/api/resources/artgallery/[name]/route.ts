export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ArtPieces from "@/model/ArtPieces";

export async function GET(
  _req: Request,
  { params }: { params: { name: string } } // route param name is [name]
) {
  try {
    // 1) connect to MongoDB
    const conn = await connectToDatabase();
    console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected

    // 2) get and decode the name
    const { name } = params;

    // 3) find the art piece and return it
     const artpiece = await ArtPieces.findOneAndUpdate(
      { title: name },
      { $inc: { views: 1 } },
      {
        new: true,         // return the updated document
        lean: true,        // return plain JS object (faster)
        writeConcern: { w: 1 } // ensure the server acknowledges the write
      }
    );

    if (!artpiece) {
      return NextResponse.json(
        { error: "Art piece not found" },
        { status: 404 }
      );
    }

    // 4) return the updated art piece
    return NextResponse.json(artpiece);
  } catch (error) {
    console.error("GET /api/resources/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
