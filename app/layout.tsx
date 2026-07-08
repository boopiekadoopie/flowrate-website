import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flowrate Agency | Irrigation & Landscaping Marketing Agency That Books More Jobs",
  description:
    "Flowrate builds high-converting websites for irrigation companies. Homeowners Google three contractors. Make sure they call yours.",
  metadataBase: new URL("https://flowrate.agency"),
  openGraph: {
    title: "Flowrate Agency | Irrigation & Landscaping Marketing Agency That Books More Jobs",
    description:
      "I build websites that win the trust of homeowners who are anxious about being overcharged.",
    url: "https://flowrate.agency",
    siteName: "Flowrate Agency",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${archivo.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
