"use client";

import { useEffect, useMemo, useState } from "react";

import { defaultContent } from "@/components/marketing/site-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const contentKeys = ["hero", "value", "how", "printers", "testimonials", "faq", "finalCta", "footer"] as const;

type Settings = {
  seo_title: string;
  seo_description: string;
  ga4_id: string;
  meta_pixel_id: string;
  gtm_id: string;
};

type ContentState = Record<string, string>;

type Lead = {
  id: number;
  created_at: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  monthly_volume: string;
  printers_needed: string;
};

export function AdminDashboard() {
  const [settings, setSettings] = useState<Settings>({
    seo_title: "",
    seo_description: "",
    ga4_id: "",
    meta_pixel_id: "",
    gtm_id: "",
  });
  const [content, setContent] = useState<ContentState>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const defaultJson = useMemo(() => {
    const base: ContentState = {};
    contentKeys.forEach((key) => {
      base[key] = JSON.stringify((defaultContent as any)[key], null, 2);
    });
    return base;
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, contentRes, leadsRes, analyticsRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/content"),
          fetch("/api/admin/leads"),
          fetch("/api/admin/analytics"),
        ]);

        if (settingsRes.ok) {
          const result = await settingsRes.json();
          setSettings({
            seo_title: result.data?.seo_title || "",
            seo_description: result.data?.seo_description || "",
            ga4_id: result.data?.ga4_id || "",
            meta_pixel_id: result.data?.meta_pixel_id || "",
            gtm_id: result.data?.gtm_id || "",
          });
        }

        if (contentRes.ok) {
          const result = await contentRes.json();
          const mapped = { ...defaultJson };
          (result.data || []).forEach((item: any) => {
            if (item.key && item.data) {
              mapped[item.key] = JSON.stringify(item.data, null, 2);
            }
          });
          setContent(mapped);
        } else {
          setContent(defaultJson);
        }

        if (leadsRes.ok) {
          const result = await leadsRes.json();
          setLeads(result.data || []);
        }

        if (analyticsRes.ok) {
          const result = await analyticsRes.json();
          setAnalytics(result);
        }
      } catch (error) {
        setContent(defaultJson);
      }
    }

    loadData();
  }, [defaultJson]);

  async function saveSettings() {
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setLoading(false);
  }

  async function saveContent(key: string) {
    setLoading(true);
    try {
      const parsed = JSON.parse(content[key]);
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data: parsed }),
      });
    } catch (error) {
      alert("JSON non valido");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard amministrazione</h1>
            <p className="text-sm text-muted-foreground">Controlla performance, contenuti e impostazioni SEO.</p>
          </div>
          <Button variant="outline" asChild>
            <a href="/">Torna al sito</a>
          </Button>
        </div>

        <Tabs defaultValue="analytics" className="mt-8">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="leads">Lead</TabsTrigger>
            <TabsTrigger value="content">Contenuti</TabsTrigger>
            <TabsTrigger value="settings">SEO & Pixel</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="grid gap-6 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Eventi tracciati</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">{analytics?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Ultimi 500 eventi registrati</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top pagine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {(analytics?.data?.byPath || []).map((item: any) => (
                    <div key={item.label} className="flex justify-between">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top referrer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {(analytics?.data?.byReferrer || []).map((item: any) => (
                    <div key={item.label} className="flex justify-between">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top paesi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {(analytics?.data?.byCountry || []).map((item: any) => (
                    <div key={item.label} className="flex justify-between">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Lead ricevuti</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Azienda</TableHead>
                      <TableHead>Contatto</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefono</TableHead>
                      <TableHead>Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{new Date(lead.created_at).toLocaleDateString("it-IT")}</TableCell>
                        <TableCell>{lead.company_name}</TableCell>
                        <TableCell>{lead.contact_name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.monthly_volume}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid gap-6">
              {contentKeys.map((key) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>Sezione: {key}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={content[key] || defaultJson[key]}
                      onChange={(event) => setContent({ ...content, [key]: event.target.value })}
                      className="min-h-[200px] font-mono text-xs"
                    />
                    <Button onClick={() => saveContent(key)} disabled={loading}>
                      Salva sezione
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>SEO e tracking</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={settings.seo_title}
                    onChange={(event) => setSettings({ ...settings, seo_title: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea
                    value={settings.seo_description}
                    onChange={(event) => setSettings({ ...settings, seo_description: event.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>GA4 ID</Label>
                    <Input
                      value={settings.ga4_id}
                      onChange={(event) => setSettings({ ...settings, ga4_id: event.target.value })}
                      placeholder="G-XXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Pixel ID</Label>
                    <Input
                      value={settings.meta_pixel_id}
                      onChange={(event) => setSettings({ ...settings, meta_pixel_id: event.target.value })}
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GTM ID</Label>
                    <Input
                      value={settings.gtm_id}
                      onChange={(event) => setSettings({ ...settings, gtm_id: event.target.value })}
                      placeholder="GTM-XXXX"
                    />
                  </div>
                </div>
                <Button onClick={saveSettings} disabled={loading}>
                  Salva impostazioni
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
