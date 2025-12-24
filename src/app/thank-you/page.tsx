import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Perfetto, richiesta inviata!</CardTitle>
            <p className="text-muted-foreground">
              Abbiamo ricevuto i tuoi dati. Stiamo preparando la soluzione piu adatta al tuo volume di stampa.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Ti ricontattiamo entro 24 ore lavorative con una proposta chiara e su misura.</p>
              <ol className="space-y-2">
                <li>1. Verifichiamo il profilo di stampa (A4/A3, colore/BN, numero dispositivi)</li>
                <li>2. Se serve, ti facciamo 2 domande rapide per rifinire l'offerta</li>
                <li>3. Ti inviamo proposta + prossimi step per l'installazione</li>
              </ol>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/">Torna alla home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="mailto:info@stampantigratis.it">Prenota una chiamata</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
