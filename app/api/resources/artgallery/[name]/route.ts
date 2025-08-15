export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ArtPieces from "@/model/ArtPieces";
import mongoose from "mongoose";

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
        new: true, // return the updated document
        lean: true, // return plain JS object (faster)
        writeConcern: { w: 1 }, // ensure the server acknowledges the write
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { name: string } } // route param name is [name]
) {
  try {
    const conn = await connectToDatabase();
    console.log("Mongo readyState:", conn.connection.readyState);

    const { name } = params;

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Request body required" },
        { status: 400 }
      );
    }

    const { userId, action } = body;
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required in body" },
        { status: 400 }
      );
    }

    // convert to ObjectId if it's a valid one (optional)
    const likeValue = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId; // fallback to string if you store strings


    let updated;
    if (action === "remove") {
      updated = await ArtPieces.findOneAndUpdate(
        { title: name },
        { $pull: { likes: likeValue } },
        { new: true, lean: true, writeConcern: { w: 1 } }
      );
    } else {
      // default -> add
      updated = await ArtPieces.findOneAndUpdate(
        { title: name },
        { $addToSet: { likes: likeValue } },
        { new: true, lean: true, writeConcern: { w: 1 } }
      );
    }

    // console.log(updated)

    if (!updated) {
      return NextResponse.json(
        { error: "Art piece not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      likes: updated.likes,
      likesCount: Array.isArray(updated.likes) ? updated.likes.length : 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
