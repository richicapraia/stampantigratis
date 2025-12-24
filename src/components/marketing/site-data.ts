export const defaultContent = {
  hero: {
    title: "Ti sei stancato della tua stampante che stampa male e ti e costata una fortuna?",
    subtitle:
      "Con StampantiGratis ricevi stampanti professionali senza costo di acquisto e paghi solo a consumo. Niente sorprese: scegli la soluzione giusta in 2 minuti con il nostro questionario.",
    bullets: [
      "Stampanti A3/A4 e plotter per studi e uffici",
      "Soluzione su misura in base alle pagine/mese",
      "Qualita di stampa professionale",
    ],
    ctaPrimary: "Inizia il questionario",
    ctaSecondary: "Vedi le stampanti disponibili",
    microcopy: "Tempo stimato: 2-3 minuti • Nessun impegno • Risposta entro 24h lavorative",
    badge: "Pay-per-page / A3 / A4 / Plotter",
  },
  value: {
    title: "Il modo piu semplice per stampare bene e spendere il giusto",
    cards: [
      {
        title: "Nessun costo iniziale",
        text: "Niente investimento in hardware: scegli la stampante adatta e inizi subito.",
      },
      {
        title: "Niente ricambi, niente stress",
        text: "Toner, parti soggette a usura e gestione interventi: ci pensiamo noi.",
      },
      {
        title: "Qualita professionale",
        text: "Modelli Xerox e plotter Canon pensati per uffici e studi che vogliono risultati puliti e affidabili.",
      },
    ],
    cta: "Scopri quanto puoi risparmiare",
  },
  how: {
    title: "Come funziona (in pratica)",
    steps: [
      "Compili il questionario (2-3 minuti)",
      "Analizziamo il tuo volume (pagine, colori, A3/A4, numero stampanti)",
      "Ricevi la proposta su misura e scegli quando partire",
    ],
    micro: "Nessuna chiamata a freddo: ti contattiamo solo con informazioni utili e una proposta chiara.",
  },
  printers: {
    title: "Le stampanti che possiamo portarti (in base al tuo volume)",
    items: [
      {
        name: "Xerox VersaLink C805",
        subtitle: "Multifunzione A3",
        ideal: "Oltre 2000 pagine/mese",
        why: "Affidabilita per ufficio, A3, produttivita elevata",
        image: "/images/xerox-versalink-c805.avif",
      },
      {
        name: "Xerox WorkCentre 7835",
        subtitle: "Multifunzione A3",
        ideal: "Meno di 2000 pagine/mese",
        why: "A3 completo per chi vuole controllo costi e solidita",
        image: "/images/xerox-7830i-lato.avif",
      },
      {
        name: "Xerox C310",
        subtitle: "A4 da scrivania",
        ideal: "Postazione singola o piccoli team",
        why: "Footprint ridotto, praticita in ufficio",
        image: "/images/c310.avif",
      },
      {
        name: "Xerox AltaLink",
        subtitle: "Multifunzione A3",
        ideal: "Oltre 4000 pagine/mese",
        why: "Prestazioni e robustezza per volumi alti",
        image: "/images/altalink.avif",
      },
      {
        name: "Xerox VersaLink C405",
        subtitle: "Multifunzione a consumo",
        ideal: "Soluzione flessibile per esigenze miste",
        why: "Versatile per A4 e team dinamici",
        image: "/images/xerox-versalink-c405.avif",
      },
      {
        name: "Plotter Canon TM200",
        subtitle: "Grande formato",
        ideal: "CAD, tavole, studi tecnici",
        why: "Perfetto per disegni e stampe di precisione",
        image: "/images/tm200.avif",
      },
    ],
  },
  testimonials: {
    title: "Chi ci ha scelto stampa meglio e spende con piu controllo",
    items: [
      {
        quote: "Abbiamo eliminato i costi imprevisti.",
        author: "Studio Tecnico R. — Milano",
        text: "Prima tra toner e chiamate tecniche era un salasso. Ora paghiamo per quello che stampiamo e la qualita e nettamente migliore.",
      },
      {
        quote: "Installazione rapida e stampa A3 perfetta.",
        author: "Agenzia Immobiliare L. — Torino",
        text: "Ci serviva A3 spesso e la vecchia stampante era sempre in errore. Soluzione chiara e operativa in pochi giorni.",
      },
      {
        quote: "Finalmente un partner affidabile.",
        author: "PMI Manifatturiera S. — Bologna",
        text: "Stampiamo molto, e ogni fermo macchina costava tempo. Adesso tutto e piu lineare.",
      },
    ],
    cta: "Inizia il questionario",
  },
  faq: {
    title: "Domande frequenti",
    items: [
      {
        q: "StampantiGratis significa davvero gratis?",
        a: "Significa nessun costo di acquisto della stampante: paghi a consumo in base alle pagine stampate secondo l'offerta concordata.",
      },
      {
        q: "Cosa vuol dire pagare a consumo?",
        a: "Paghi una tariffa per pagina. Il questionario serve per stimare la configurazione e il profilo di costo.",
      },
      {
        q: "Cosa include il servizio?",
        a: "Consegna, installazione, assistenza e consumabili secondo la proposta concordata.",
      },
      {
        q: "Quanto tempo serve per avere la stampante?",
        a: "In genere 3-7 giorni lavorativi dopo conferma e disponibilita modello.",
      },
      {
        q: "Posso avere piu stampanti o cambiare modello?",
        a: "Si: in base a volume e sedi. La soluzione e modulare e si adatta alla crescita.",
      },
      {
        q: "I miei dati sono al sicuro?",
        a: "Si, li usiamo solo per elaborare la proposta e ricontattarti.",
      },
    ],
  },
  finalCta: {
    title: "Vuoi smettere di buttare soldi in stampe scadenti?",
    text: "In 2-3 minuti capiamo quante pagine stampi, quante stampanti ti servono e quale modello e piu adatto. Poi ti inviamo una proposta chiara e su misura.",
    button: "Inizia il questionario",
    micro: "Nessun impegno • Dati al sicuro • Risposta entro 24h lavorative",
  },
  footer: {
    company: "StampantiGratis",
    address: "Via Torretta 9, Pavia, 27100",
    email: "info@stampantigratis.it",
    phone: "0382-955951",
  },
};

export type SiteContent = typeof defaultContent;
