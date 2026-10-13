"use client";
import { Dashboard, DeliveryNote, Invoice, Phone } from "@/components/HeroStage";

/* Internal render route: one hero product screen frozen at step t, for capturing reel assets. */
export function Parts({ part, t, held }: { part?: string; t: number; held: boolean }) {
  return (
    <div data-theme="light" className="p-10 bg-transparent">
      <div data-part className="inline-block">
        {part === "phone" && <Phone t={t} />}
        {part === "dashboard" && <Dashboard t={t} held={held} />}
        {part === "invoice" && <Invoice t={t} held={held} />}
        {part === "card" && <DeliveryNote t={t} held={held} scanning={false} width={300} />}
      </div>
    </div>
  );
}
