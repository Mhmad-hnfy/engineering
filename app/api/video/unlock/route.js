import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code, videoId } = await request.json();

    // Mock Validation Logic
    // In a real app, check database for valid codes linked to this user/video

    // For demo: Correct code is "VIDEO2025" or any code starting with "OPEN"
    if (code === "VIDEO2025" || code.startsWith("OPEN")) {
      return NextResponse.json({ success: true, message: "Access Granted" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid Access Code" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
