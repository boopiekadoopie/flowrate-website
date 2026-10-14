import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Confession } from "@/components/Confession";

export const metadata: Metadata = {
  title: "Your spreadsheet, as an app | Flowrate",
  description: "Paste the top row of a spreadsheet you hate and see the simple app it would become: what goes in on the phone, what the office sees, what the dashboard shows.",
  alternates: { canonical: "/spreadsheet" },
  openGraph: { title: "Your spreadsheet, as an app | Flowrate", url: "/spreadsheet" },
};

export default function SpreadsheetPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <Confession />
      </main>
      <Footer />
    </>
  );
}
