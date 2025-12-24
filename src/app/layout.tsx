import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/marketing/analytics-scripts";
import { TrackView } from "@/components/marketing/track-view";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stampanti professionali senza acquisto | StampantiGratis",
  description:
    "Ricevi stampanti A3/A4 e plotter senza costo di acquisto. Paghi solo a consumo con una proposta su misura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}>
        <AnalyticsScripts />
        <Suspense fallback={null}>
          <TrackView />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
