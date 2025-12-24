import Image from "next/image";
import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings.seo_title,
    description: settings.seo_description,
  };
}

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <div className="bg-background text-foreground">
      <section className="relative hero-bg overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 grain opacity-60" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6 fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-1 text-xs uppercase tracking-[0.2em]">
              <span className="h-2 w-2 rounded-full bg-foreground" />
              <span>{content.hero.badge}</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {content.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              {content.hero.subtitle}
            </p>
            <ul className="grid gap-2 text-sm text-foreground/80 md:grid-cols-3">
              {content.hero.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-md bg-background/70 px-3 py-2">
                  <span className="text-lg">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/questionario/step-1">{content.hero.ctaPrimary}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#stampanti">{content.hero.ctaSecondary}</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{content.hero.microcopy}</p>
          </div>
          <div className="relative flex-1">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-accent/60 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-secondary/80 blur-3xl" />
            <div className="relative rounded-3xl border border-border/70 bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Stampante consigliata</Badge>
                <span className="text-xs uppercase text-muted-foreground">Live preview</span>
              </div>
              <div className="mt-6 grid gap-4">
                <Image
                  src="/images/xerox-versalink-c805.avif"
                  alt="Stampante professionale"
                  width={640}
                  height={480}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 object-cover"
                />
                <div className="grid gap-2 rounded-2xl border border-border/60 bg-background/80 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Volume stimato</span>
                    <span className="text-muted-foreground">2000+ pagine/mese</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Formato</span>
                    <span className="text-muted-foreground">A3 + A4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Formula</span>
                    <span className="text-muted-foreground">Pay-per-page</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <h2 className="text-3xl font-semibold">{content.value.title}</h2>
          <Button asChild variant="outline">
            <Link href="/questionario/step-1">{content.value.cta}</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {content.value.cards.map((card) => (
            <Card key={card.title} className="group hover:-translate-y-1 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold">{content.how.title}</h2>
            <p className="mt-3 text-muted-foreground">{content.how.micro}</p>
          </div>
          <div className="flex-1 grid gap-4">
            {content.how.steps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded-xl border border-border/60 bg-background/80 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                  0{index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stampanti" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">{content.printers.title}</h2>
          <Button asChild variant="ghost">
            <Link href="/questionario/step-1">Trova la tua soluzione</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.printers.items.map((printer) => (
            <Card key={printer.name} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{printer.name}</CardTitle>
                <CardDescription>{printer.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <Image
                  src={printer.image}
                  alt={printer.name}
                  width={520}
                  height={400}
                  className="h-40 w-full rounded-xl border border-border/60 bg-background/70 object-cover"
                />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Ideale per:</span> {printer.ideal}</p>
                  <p><span className="font-medium text-foreground">Perche sceglierla:</span> {printer.why}</p>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href="/questionario/step-1">Richiedi questa soluzione</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold">{content.testimonials.title}</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {content.testimonials.items.map((review) => (
              <Card key={review.quote} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">“{review.quote}”</CardTitle>
                  <CardDescription>{review.author}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{review.text}</CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild>
              <Link href="/questionario/step-1">{content.testimonials.cta}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold">{content.faq.title}</h2>
            <p className="mt-3 text-muted-foreground">
              Chiarezza totale prima di partire. Se hai altre domande, scrivici senza problemi.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {content.faq.items.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border/60 bg-foreground text-background">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at top, #ffffff 0%, transparent 45%)" }} />
        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold">{content.finalCta.title}</h2>
              <p className="mt-3 text-background/80">{content.finalCta.text}</p>
              <p className="mt-4 text-xs text-background/70">{content.finalCta.micro}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/questionario/step-1">{content.finalCta.button}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background bg-transparent text-background hover:bg-background/10 hover:text-background"
              >
                <Link href="#stampanti">Vedi le stampanti</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-sm text-muted-foreground md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-foreground">{content.footer.company}</p>
            <p>{content.footer.address}</p>
          </div>
          <div>
            <p>Email: {content.footer.email}</p>
            <p>Tel: {content.footer.phone}</p>
          </div>
          <div className="space-y-1">
            <p>Privacy Policy</p>
            <p>Cookie Policy</p>
            <p>Termini e condizioni</p>
            <p className="text-xs text-foreground/70">Deploy check: 2025-12-24-17</p>
            <p className="text-xs">Tutti i marchi citati appartengono ai rispettivi proprietari.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-6 md:hidden">
        <Button asChild size="lg" className="w-full max-w-sm">
          <Link href="/questionario/step-1">Inizia il questionario</Link>
        </Button>
      </div>
    </div>
  );
}
