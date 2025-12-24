import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers = request.headers;

    const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "";
    const userAgent = headers.get("user-agent") || "";

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
    }

    const payload = {
      event: body.event || "page_view",
      path: body.path || "",
      referrer: body.referrer || "",
      utm: body.utm || null,
      country,
      user_agent: userAgent,
    };

    const response = await fetch(`${url}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
