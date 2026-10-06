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
  title: "Flowrate | Custom business systems, built around how you work",
  description:
    "Flowrate builds admin systems, driver and field apps, reporting and websites around the way your business already works, so the retyping, the chasing and the month-end scramble stop.",
  metadataBase: new URL("https://flowrate.agency"),
  openGraph: {
    title: "Flowrate | We build the systems your business runs on",
    description:
      "Admin systems, driver and field apps, reporting and websites, built around the way you already work.",
    url: "https://flowrate.agency",
    siteName: "Flowrate",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 2400,
        height: 1260,
        alt: "Flowrate: we build the systems your business runs on. Example driver-to-invoice system.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowrate | We build the systems your business runs on",
    description:
      "Admin systems, driver and field apps, reporting and websites, built around the way you already work.",
    images: ["/og-home.jpg"],
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
