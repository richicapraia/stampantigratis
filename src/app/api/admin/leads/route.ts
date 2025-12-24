import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("leads")
    .select("id, created_at, company_name, contact_name, email, phone, monthly_volume, printers_needed")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
