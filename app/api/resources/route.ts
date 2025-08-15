export const dynamic = "force-dynamic";

// app/api/resources/[slug]/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Course from "@/model/Course";
import Guides from "@/model/Guide";
import Videos from "@/model/Videos";
import Researchs from "@/model/Researchs";
import ArtPieces from "@/model/ArtPieces";

export async function GET(_req: Request) {
  // 1) connect to MongoDB
  const conn = await connectToDatabase();
  console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected

  // 2) find the course by slug
  const allCourses = await Course.find(
    {},
    {
      numberOfLesson: 1,
      duration: 1,
      level: 1,
      title: 1,
      intro: 1,
      createdAt: 1,
      slug: 1,
      type: 1,
      _id: 0,
    }
  ).lean();

  // 3) find the guide by slug
  const allGuides = await Guides.find(
    {},
    {
      slug: 1,
      title: 1,
      description: 1,
      heroImage: 1,
      presentationLink: 1,
      type: 1,
      _id: 0,
    }
  ).lean();

  // 3) find the videos
  const allVideos = await Videos.find(
    {},
    {
      title: 1,
      description: 1,
      videoLink: 1,
      type: 1,
      duration: 1,
      uploadDate: 1,
      authors: 1,
      _id: 0,
    }
  ).lean();
  const allResearchs = await Researchs.find(
    {},
    {
      title: 1,
      abstract: 1,
      authors: 1,
      researchLink: 1,
      type: 1,
      slug: 1,
      keywords: 1,
      year: 1,
      _id: 0,
    }
  ).lean();

  const allArtPieces = await ArtPieces.find(
    {},
    {
      title: 1,
      artist: 1,
      year: 1,
      description: 1,
      image: 1,
      type: 1,
      medium: 1
    }
  );
  let returnGuides = [
    ...allCourses,
    ...allGuides,
    ...allVideos,
    ...allResearchs,
    ...allArtPieces
  ];

  // 4) return the found course and guide
  return NextResponse.json(returnGuides);
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  console.log("POST body:", body);

  // 1) connect
  const conn = await connectToDatabase();
  console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected

  // 2) create or update course by slug
  const { slug } = params;
  let course = await Course.findOneAndUpdate({ slug }, body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  // 3) return the new or updated course
  return NextResponse.json(course);
}
