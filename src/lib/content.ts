import { defaultContent, type SiteContent } from "@/components/marketing/site-data";
import { createPublicClient } from "@/lib/supabase-public";

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_content")
      .select("key, data");

    if (!data || data.length === 0) {
      return defaultContent;
    }

    const merged: SiteContent = { ...defaultContent };
    for (const row of data) {
      if (row.key && row.data && typeof row.data === "object") {
        // @ts-expect-error - dynamic content
        merged[row.key] = row.data;
      }
    }

    return merged;
  } catch (error) {
    return defaultContent;
  }
}
