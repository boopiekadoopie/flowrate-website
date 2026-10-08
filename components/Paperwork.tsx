import type { CSSProperties } from "react";

/*
 * The everyday mess a business runs on: a till slip, a group chat, a spreadsheet, a sticky note,
 * an email thread and a paper job card. Shared by the hero backdrop and the social covers.
 * Every business is a made-up everyday one (café, salon, supply shop); nothing industry-specific.
 * These are physical objects, so they keep their own paper colours in both themes.
 */

export const paperShadow = "shadow-[0_18px_36px_-16px_rgba(16,24,40,0.45)]";

export function Receipt() {
  return (
    <div className={`w-[132px] bg-[#FDFDFB] font-mono text-[8px] leading-[1.6] text-[#333] px-3 pt-3 pb-5 ${paperShadow} [clip-path:polygon(0_0,100%_0,100%_96%,92%_100%,84%_96%,76%_100%,68%_96%,60%_100%,52%_96%,44%_100%,36%_96%,28%_100%,20%_96%,12%_100%,4%_96%,0_100%)]`}>
      <p className="font-bold text-center tracking-[0.12em] mb-1">CORNER SUPPLY</p>
      <p className="text-center opacity-60 mb-2">14/10 · 08:12</p>
      {[["Paper towels", "84.00"], ["Cleaning kit", "129.50"], ["Delivery", "60.00"]].map(([a, b]) => (
        <p key={a} className="flex justify-between"><span>{a}</span><span>{b}</span></p>
      ))}
      <p className="flex justify-between font-bold border-t border-dashed border-black/30 mt-1.5 pt-1"><span>TOTAL</span><span>273.50</span></p>
    </div>
  );
}

export function Chat() {
  return (
    <div className={`w-[230px] rounded-[14px] rounded-tl-[4px] bg-white border border-[#E5E7EB] px-3.5 py-2.5 ${paperShadow}`}>
      <p className="text-[10px] font-semibold text-[#1D6B2B]">Team group</p>
      <p className="text-[13px] text-[#101828] leading-snug mt-0.5">Did anyone send the quote to Hill &amp; Co? They&apos;re asking again</p>
      <p className="text-[10px] text-[#99A1AF] text-right mt-0.5">16:48</p>
    </div>
  );
}

export function Sheet() {
  const rows = [["Greenway", "Done", "?"], ["Hill & Co", "Done", "Paid"], ["Mara's", "Booked", ""]];
  return (
    <div className={`w-[230px] bg-white border border-[#E5E7EB] rounded-[6px] overflow-hidden text-[11px] ${paperShadow}`}>
      <div className="grid grid-cols-[1.3fr_1fr_0.8fr] bg-[#F7F7F7] text-[#6A7282] border-b border-[#E5E7EB]">
        {["Customer", "Job", "Invoice"].map((h) => <span key={h} className="px-2 py-1 border-r border-[#E5E7EB] last:border-0">{h}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="grid grid-cols-[1.3fr_1fr_0.8fr] border-b border-[#F0F0F0] last:border-0">
          <span className="px-2 py-1 border-r border-[#F0F0F0] text-[#101828]">{r[0]}</span>
          <span className="px-2 py-1 border-r border-[#F0F0F0] text-[#4A5565]">{r[1]}</span>
          <span className={`px-2 py-1 ${r[2] === "Paid" ? "text-[#6A7282]" : "bg-[#FEF3C7] text-[#92400E]"}`}>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

export function Sticky() {
  return (
    <div className="w-[136px] h-[124px] bg-[#FDF1A8] p-3 shadow-[0_16px_30px_-14px_rgba(120,90,10,0.5)] text-[#4A3B07]">
      <p className="text-[13px] leading-[1.3] font-semibold">Call back Mara&apos;s about Friday booking!!</p>
      <p className="text-[11px] mt-2 opacity-70">who has her number?</p>
    </div>
  );
}

export function Mail() {
  return (
    <div className={`w-[240px] rounded-[8px] bg-white border border-[#E5E7EB] px-3.5 py-2.5 ${paperShadow}`}>
      <div className="flex justify-between text-[10px] text-[#99A1AF]"><span>Inbox</span><span>Mon 09:14</span></div>
      <p className="text-[12.5px] font-semibold text-[#101828] mt-0.5 truncate">Re: Re: Fwd: where is my order?</p>
      <p className="text-[11px] text-[#6A7282] mt-0.5 leading-snug">Still waiting on an update, can someone let me know…</p>
    </div>
  );
}

/*
 * A printed job card from a pad, filled in by hand (pen-blue values on ruled fields) and
 * signed. Printed form, not an illustration: rules, labels and a carbon-copy header.
 */
const pen: CSSProperties = { color: "#1E3A8A" };

export function JobCard({ width = 150 }: { width?: number }) {
  const field = (label: string, value: string, wide = false) => (
    <div className={`border-b border-[#B9BDC6] pb-[2px] ${wide ? "col-span-2" : ""}`}>
      <p className="text-[5.5px] uppercase tracking-[0.1em] text-[#8A8F99] leading-none">{label}</p>
      <p className="text-[8.5px] leading-[1.25] mt-[2px] font-medium" style={pen}>{value}</p>
    </div>
  );
  return (
    <div
      className="bg-[#FCFCFA] text-[#333] px-3 pt-2.5 pb-3 shadow-[0_18px_36px_-16px_rgba(16,24,40,0.45)]"
      style={{ width, fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}
    >
      <div className="flex items-baseline justify-between border-b-[1.5px] border-[#333] pb-1.5">
        <p className="font-bold text-[9px] tracking-[0.08em]">JOB CARD</p>
        <p className="text-[7px] text-[#8A8F99]">No. <span className="font-mono text-[#333]">0418</span></p>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2">
        {field("Customer", "Greenway Café", true)}
        {field("Date", "14 / 10")}
        {field("Time", "08:30")}
        {field("Job", "Fridge not cooling — door seal", true)}
        {field("Parts", "Door seal × 1")}
        {field("Done by", "Sam")}
      </div>
      <div className="mt-2.5 grid grid-cols-[1fr_auto] items-end gap-2">
        <div className="border-b border-[#B9BDC6] pb-[2px]">
          <p className="text-[5.5px] uppercase tracking-[0.1em] text-[#8A8F99] leading-none">Customer signature</p>
          <svg viewBox="0 0 80 14" className="w-[64px] h-[12px] mt-[1px]" aria-hidden>
            <path d="M2 10 C 8 2, 12 2, 16 9 S 24 12, 28 6 S 36 3, 40 9 S 50 12, 56 5 S 66 4, 78 8" fill="none" stroke="#1E3A8A" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        </div>
        <span className="rotate-[-6deg] border-[1.5px] border-[#C2410C]/80 text-[#C2410C]/85 text-[6px] font-bold tracking-[0.12em] px-1.5 py-[2px] rounded-[2px] leading-none">NOT INVOICED</span>
      </div>
    </div>
  );
}
