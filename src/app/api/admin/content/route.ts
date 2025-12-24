import { NextResponse } from "next/server";

import { createApiClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await createApiClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.from("site_content").select("key, data");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createApiClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { key, data } = body;

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const { error } = await supabase.from("site_content").upsert({ key, data });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
