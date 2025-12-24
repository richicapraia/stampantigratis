import { NextResponse } from "next/server";

import { createApiClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createApiClient();

    const { error } = await supabase.from("leads").insert({
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
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
