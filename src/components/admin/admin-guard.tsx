"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { createClient } from "@/lib/supabase-client";

export function AdminGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setHasSession(true);
      setReady(true);
    });
  }, [router]);

  if (!ready || !hasSession) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-muted-foreground">
          Caricamento area admin...
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}
