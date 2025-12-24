"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function TrackView() {
  const pathname = usePathname();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
    };

    if (Object.values(utm).some(Boolean)) {
      window.localStorage.setItem("stampantigratis_utm", JSON.stringify(utm));
    }

    const payload = {
      event: "page_view",
      path: pathname,
      referrer: document.referrer,
      utm,
    };

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
    }
  }, [pathname]);

  return null;
}
