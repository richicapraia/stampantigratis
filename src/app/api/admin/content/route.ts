import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase.from("site_content").select("key, data");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createAdminClient();

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
