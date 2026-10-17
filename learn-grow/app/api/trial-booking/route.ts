import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, parentPhone, parentEmail, studentAge, trackInterest } = body || {};

    if (!parentName || !parentPhone || !parentEmail || !studentAge || !trackInterest) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const baseRaw = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || "http://localhost:5005";
    const apiUrl = baseRaw.endsWith("/api") ? baseRaw : `${baseRaw.replace(/\/+$/, "")}/api`;

    // Forward client headers for Meta CAPI and TikTok Events API accurate matching
    const forwardedFor = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const userAgent = req.headers.get("user-agent") || "";
    const cookie = req.headers.get("cookie") || "";
    
    const res = await fetch(`${apiUrl}/trial-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
        ...(userAgent ? { "user-agent": userAgent } : {}),
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process booking" },
      { status: 500 }
    );
  }
}
