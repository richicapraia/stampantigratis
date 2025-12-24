import { NextResponse } from "next/server";

import { createApiClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await createApiClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
