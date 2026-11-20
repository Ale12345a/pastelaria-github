import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});



export const metadata: Metadata = {
  title: {
    default: "Pastelaria | Pastelaria e Padaria",
    template: "%s | Pastelaria",
  },
  description:
    "Descobre os nossos produtos de pastelaria, padaria, bolos para ocasiões especiais, pequenos-almoços e encomendas.",
  applicationName: "Pastelaria",
  openGraph: {
    title: "Pastelaria | Pastelaria e Padaria",
    description:
      "Feito com dedicação, servido com carinho e pensado para tornar cada momento ainda mais especial.",
    locale: "pt_PT",
    type: "website",
    siteName: "Pastelaria",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${playfair.variable} ${lato.variable}`}>
        {children}
      </body>
    </html>
  );
}
