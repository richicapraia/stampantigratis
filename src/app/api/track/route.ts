import { NextResponse } from "next/server";

import { createApiClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createApiClient();
    const headers = request.headers;

    const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "";
    const userAgent = headers.get("user-agent") || "";

    const { error } = await supabase.from("analytics_events").insert({
      event: body.event || "page_view",
      path: body.path || "",
      referrer: body.referrer || "",
      utm: body.utm || null,
      country,
      user_agent: userAgent,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
