import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ status: "ok", version: "2025-12-24" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
    }

    const payload = {
      company_name: body.companyName,
      vat: body.vat,
      sector: body.sector,
      address: body.address,
      city: body.city,
      province: body.province,
      postal_code: body.postalCode,
      locations: body.locations,
      people_printing: body.peoplePrinting,
      monthly_volume: body.monthlyVolume,
      color_mix: body.colorMix,
      formats: body.formats,
      printers_needed: body.printersNeeded,
      distribution: body.distribution,
      functions: body.functions,
      priorities: body.priorities,
      document_types: body.documentTypes,
      model_preference: body.modelPreference,
      model_note: body.modelNote,
      contact_name: body.contactName,
      role: body.role,
      email: body.email,
      phone: body.phone,
      contact_preference: body.contactPreference,
      note: body.note,
      consent_privacy: body.consentPrivacy,
      consent_marketing: body.consentMarketing,
      utm: body.utm,
      payload: body,
    };

    const response = await fetch(`${url}/rest/v1/leads`, {
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
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
