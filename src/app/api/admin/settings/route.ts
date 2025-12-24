import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("seo_title, seo_description, ga4_id, meta_pixel_id, gtm_id")
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createAdminClient();

  const body = await request.json();
  const payload = {
    id: 1,
    seo_title: body.seo_title,
    seo_description: body.seo_description,
    ga4_id: body.ga4_id,
    meta_pixel_id: body.meta_pixel_id,
    gtm_id: body.gtm_id,
  };

  const { error } = await supabase.from("site_settings").upsert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
