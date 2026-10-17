import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// SHA-256 helper for Meta match quality (lowercase, trimmed)
const hashSha256 = (value?: string): string | undefined => {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash("sha256").update(clean).digest("hex");
};

// Normalize and hash phone numbers (E.164 without plus or special chars)
const hashPhone = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  let digits = phone.replace(/[^0-9]/g, "");
  // Bangladesh standard: 01XXXXXXXXX -> 8801XXXXXXXXX
  if (digits.startsWith("01") && digits.length === 11) {
    digits = "88" + digits;
  }
  return crypto.createHash("sha256").update(digits).digest("hex");
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventId, eventSourceUrl, userData = {}, customData = {} } = body;

    const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    const testEventCode = process.env.META_TEST_EVENT_CODE;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Meta Pixel ID or CAPI Access Token not configured yet in environment variables",
          ready: false,
        },
        { status: 200 }
      );
    }

    // Extract client IP (handling reverse proxies & load balancers)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : req.headers.get("x-real-ip") || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    // Extract first-party browser cookies for Meta (_fbp & _fbc)
    const fbp = req.cookies.get("_fbp")?.value || userData.fbp;
    const fbc = req.cookies.get("_fbc")?.value || userData.fbc;

    // Hash sensitive user parameters with SHA-256
    const hashedEmail = hashSha256(userData.email);
    const hashedPhone = hashPhone(userData.phone);
    const hashedFn = hashSha256(userData.firstName || userData.name?.split(" ")[0]);
    const hashedLn = hashSha256(userData.lastName || userData.name?.split(" ").slice(1).join(" "));

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId, // Shared ID between Pixel and CAPI for automatic deduplication
          event_source_url: eventSourceUrl || req.headers.get("referer") || "https://learnandgrow.io",
          action_source: "website",
          user_data: {
            ...(hashedEmail ? { em: [hashedEmail] } : {}),
            ...(hashedPhone ? { ph: [hashedPhone] } : {}),
            ...(hashedFn ? { fn: [hashedFn] } : {}),
            ...(hashedLn ? { ln: [hashedLn] } : {}),
            ...(clientIp ? { client_ip_address: clientIp } : {}),
            ...(userAgent ? { client_user_agent: userAgent } : {}),
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
          },
          custom_data: {
            ...customData,
            currency: customData.currency || "BDT",
          },
        },
      ],
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
    };

    const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
    const res = await fetch(metaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resJson = await res.json();
    return NextResponse.json({
      success: res.ok,
      metaResponse: resJson,
      eventId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to dispatch Meta CAPI event",
      },
      { status: 500 }
    );
  }
}
