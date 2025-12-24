import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase-admin";

function aggregate(events: Array<{ path: string | null; referrer: string | null; country: string | null }>) {
  const byPath = new Map<string, number>();
  const byReferrer = new Map<string, number>();
  const byCountry = new Map<string, number>();

  for (const event of events) {
    const path = event.path || "-";
    const referrer = event.referrer || "direct";
    const country = event.country || "-";

    byPath.set(path, (byPath.get(path) || 0) + 1);
    byReferrer.set(referrer, (byReferrer.get(referrer) || 0) + 1);
    byCountry.set(country, (byCountry.get(country) || 0) + 1);
  }

  const toSortedArray = (map: Map<string, number>) =>
    Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

  return {
    byPath: toSortedArray(byPath),
    byReferrer: toSortedArray(byReferrer),
    byCountry: toSortedArray(byCountry),
  };
}

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("analytics_events")
    .select("path, referrer, country")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const summary = aggregate(data || []);
  return NextResponse.json({ data: summary, total: (data || []).length });
}
