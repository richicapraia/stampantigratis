import { createPublicClient } from "@/lib/supabase-public";

export type SiteSettings = {
  seo_title: string;
  seo_description: string;
  ga4_id?: string | null;
  meta_pixel_id?: string | null;
  gtm_id?: string | null;
};

export const defaultSettings: SiteSettings = {
  seo_title: "Stampanti professionali senza acquisto | StampantiGratis",
  seo_description:
    "Ricevi stampanti A3/A4 e plotter senza costo di acquisto. Paghi solo a consumo con una proposta su misura.",
  ga4_id: "",
  meta_pixel_id: "",
  gtm_id: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("seo_title, seo_description, ga4_id, meta_pixel_id, gtm_id")
      .limit(1)
      .maybeSingle();

    if (!data) {
      return defaultSettings;
    }

    return {
      seo_title: data.seo_title || defaultSettings.seo_title,
      seo_description: data.seo_description || defaultSettings.seo_description,
      ga4_id: data.ga4_id || "",
      meta_pixel_id: data.meta_pixel_id || "",
      gtm_id: data.gtm_id || "",
    };
  } catch (error) {
    return defaultSettings;
  }
}
