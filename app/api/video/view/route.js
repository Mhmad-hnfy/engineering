import { NextResponse } from "next/server";

// Mock In-Memory Store for Views (Resets on server restart)
// In production, use a database (MongoDB, Postgres, etc.)
let videoViews = [];

export async function POST(request) {
  try {
    const { userId, videoId } = await request.json();

    const viewRecord = {
      userId: userId || "anonymous",
      videoId,
      watchedAt: new Date().toISOString(),
    };

    videoViews.push(viewRecord);
    console.log("New View Recorded:", viewRecord);

    return NextResponse.json({ success: true, message: "View tracked" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error tracking view" },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Admin endpoint to get stats
  return NextResponse.json({
    totalViews: videoViews.length,
    views: videoViews,
  });
}
