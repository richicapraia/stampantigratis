"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("Credenziali non valide.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError("Configura prima le variabili Supabase in .env.local");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Area amministrazione</CardTitle>
            <p className="text-sm text-muted-foreground">Accedi per gestire contenuti, analytics e impostazioni.</p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="admin@stampantigratis.it" required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input name="password" type="password" placeholder="********" required />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? "Accesso..." : "Accedi"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
