import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

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
  title: "Flowrate | Custom apps and business systems, built around how you work",
  description:
    "Custom apps, business systems, dashboards and websites built around how your business already works, so nobody types the same job in twice.",
  metadataBase: new URL("https://flowrate.agency"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Flowrate | We build the systems your business runs on",
    description:
      "Admin systems, field apps, reporting and websites, built around the way you already work.",
    url: "https://flowrate.agency",
    siteName: "Flowrate",
    type: "website",
    images: [
      {
        url: "/og-home-v2.jpg",
        width: 2400,
        height: 1260,
        alt: "Flowrate: we build the systems your business runs on. Example: a signed job card sent from a phone becomes a draft invoice.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowrate | We build the systems your business runs on",
    description:
      "Admin systems, field apps, reporting and websites, built around the way you already work.",
    images: ["/og-home-v2.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${archivo.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Apply the saved (or device) theme before first paint, so there is no light flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
