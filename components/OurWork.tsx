"use client";
import Link from "next/link";
import { Arrow, Container, H2, Lede, Reveal } from "./ui";
import { HdLaptop, HdPhone, HomeBar, StatusBar } from "./kit/Device";

/*
 * Our work, short: the three real apps from /work (made-up names), each on a real device at its first screen,
 * with a link straight into its demo. Replaces the single-fleet case study: proof without the long story.
 */

const INK = "#101828";
const OK = { background: "#EAF8E6", color: "#1D6B2B" };

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[9px] bg-white border border-black/[0.07] px-2.5 py-[6px]">
      <p className="text-[8px] font-semibold uppercase tracking-[0.05em] text-[#98A2B3] leading-none">{k}</p>
      <p className="mt-0.5 text-[11px] font-semibold leading-tight" style={{ color: INK }}>{v}</p>
    </div>
  );
}

function DriverScreen() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F4F4F2]" style={{ color: INK }}>
      <StatusBar time="6:42" />
      <div className="px-3 pt-1">
        <p className="text-[9.5px] font-semibold text-[#667085]">Northline Transport</p>
        <p className="text-[16px] font-bold tracking-[-0.02em] leading-tight">New load</p>
      </div>
      <div className="px-2.5 mt-2.5 flex flex-col gap-1.5">
        <div className="grid grid-cols-2 gap-1 p-[3px] rounded-[9px] bg-black/[0.05] text-[10px] font-semibold text-center">
          <span className="py-[5px] text-[#667085]">Tipper</span>
          <span className="py-[5px] rounded-[7px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.12)]">Tanker</span>
        </div>
        <Row k="Truck" v="TNK 09" />
        <Row k="Driver" v="Sam M." />
        <div className="rounded-[9px] bg-white border border-black/[0.07] px-2.5 py-[6px]">
          <p className="text-[8px] font-semibold uppercase tracking-[0.05em] text-[#98A2B3] leading-none">Load documents</p>
          <div className="mt-1 flex items-center gap-1.5">
            {[0, 1].map((i) => (
              <span key={i} className="relative w-[24px] h-[30px] rounded-[4px] bg-[#F2F4F7] border border-black/[0.06] flex flex-col justify-center gap-[3px] px-[4px]">
                <span className="h-[2px] rounded bg-[#D0D5DD]" /><span className="h-[2px] w-2/3 rounded bg-[#D0D5DD]" /><span className="h-[2px] rounded bg-[#D0D5DD]" />
                <span className="absolute -right-1 -bottom-1 w-[11px] h-[11px] rounded-full bg-[#1D6B2B] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-[7px] h-[7px]" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </span>
              </span>
            ))}
            <span className="text-[9.5px] text-[#667085]">2 added</span>
          </div>
        </div>
        <Row k="Seals" v="40317 · 40318" />
      </div>
      <div className="px-2.5 mt-auto mb-[22px]">
        <div className="h-[32px] rounded-[10px] flex items-center justify-center text-[11px] font-bold text-white" style={{ background: INK }}>Submit load</div>
      </div>
      <HomeBar />
    </div>
  );
}

function ChecklistScreen() {
  const checks: [string, "ok" | "fault" | "na"][] = [["Tyres", "ok"], ["Lights", "ok"], ["Brakes", "fault"], ["Oil level", "ok"], ["Horn", "na"]];
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F4F4F2]" style={{ color: INK }}>
      <StatusBar time="6:15" />
      <div className="px-3 pt-1">
        <p className="text-[9.5px] font-semibold text-[#667085]">TNK 09 · Sam M.</p>
        <p className="text-[16px] font-bold tracking-[-0.02em] leading-tight">Pre-start check</p>
      </div>
      <div className="px-2.5 mt-2.5 flex flex-col gap-1">
        {checks.map(([c, st]) => (
          <div key={c} className={`flex items-center justify-between rounded-[9px] px-2.5 py-[6px] border ${st === "fault" ? "bg-[#FEF3F2] border-[#FECDCA]" : "bg-white border-black/[0.07]"}`}>
            <span className="text-[11px] font-semibold">{c}</span>
            <span
              className="text-[9px] font-semibold rounded-[5px] px-1.5 py-[2px]"
              style={st === "ok" ? OK : st === "fault" ? { background: "#D92D20", color: "#fff" } : { background: "#F2F4F7", color: "#475467" }}
            >
              {st === "ok" ? "OK" : st === "fault" ? "Fault" : "N/A"}
            </span>
          </div>
        ))}
      </div>
      <div className="mx-2.5 mt-auto mb-[22px] rounded-[10px] bg-[#D92D20] text-white px-2.5 py-2">
        <p className="text-[10.5px] font-bold leading-tight">Brake fault: don&apos;t start this truck</p>
        <p className="text-[9px] text-white/80 mt-0.5">Report sent to the supervisor</p>
      </div>
      <HomeBar />
    </div>
  );
}

function RegisterScreen() {
  const rows = [["40316", "200 mm", "Batch 88"], ["40317", "200 mm", "Batch 88"], ["40318", "180 mm", "Batch 88"]];
  return (
    <div className="h-full flex flex-col bg-[#F6F7F9]" style={{ color: INK }}>
      <div className="h-[30px] shrink-0 flex items-center gap-3 px-3 bg-white border-b border-[#E5E7EB]">
        <span className="text-[11px] font-extrabold tracking-tight">Pole register</span>
        {["Capture", "Check", "Search", "Certificate"].map((t) => (
          <span key={t} className={`text-[9.5px] font-semibold ${t === "Search" ? "text-[#101828]" : "text-[#98A2B3]"}`}>{t}</span>
        ))}
      </div>
      <div className="px-3 pt-2.5">
        <div className="h-[26px] rounded-[7px] bg-white border border-[#D4D4D4] flex items-center px-2 text-[10.5px] font-semibold">40317</div>
        <div className="mt-2 rounded-[8px] bg-white border border-[#E5E7EB] px-2.5 py-2 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold">Pole 40317 <span className="font-normal text-[#4A5565]">· 200 mm · treated 12 Oct</span></p>
            <span className="inline-flex mt-1 text-[9px] font-semibold rounded-[4px] px-1.5 py-[1px]" style={OK}>Certificate ready</span>
          </div>
          <span className="text-[9.5px] font-bold rounded-[6px] px-2 py-1 text-white" style={{ background: INK }}>Open</span>
        </div>
        <div className="mt-2 rounded-[8px] bg-white border border-[#E5E7EB] overflow-hidden">
          {rows.map((r) => (
            <div key={r[0]} className="grid grid-cols-3 px-2.5 py-[5px] border-b border-[#F2F4F7] last:border-0 text-[9.5px]">
              <span className="font-semibold">Pole {r[0]}</span><span className="text-[#4A5565]">{r[1]}</span><span className="text-[#4A5565]">{r[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const APPS = [
  { id: "driver-app", who: "Built for a logistics company", name: "The driver app", line: "Load documents sent from the road, straight to the office.", device: <HdPhone w={172}><DriverScreen /></HdPhone> },
  { id: "workshop-checklist", who: "Built for a transport fleet's workshop", name: "The pre-start checklist", line: "Daily machine checks on the phone. A fault that matters stops the truck.", device: <HdPhone w={172}><ChecklistScreen /></HdPhone> },
  { id: "pole-register", who: "Built for a timber treatment plant", name: "The quality register", line: "Handwritten inspection sheets turned into a record you can search.", device: <HdLaptop w={300}><div style={{ zoom: 0.84, width: 342, height: 213 }}><RegisterScreen /></div></HdLaptop> },
];

export function OurWork() {
  return (
    <section id="our-work" className="bg-paper py-20 md:py-28 border-t border-line">
      <Container>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-16 lg:items-end mb-10 md:mb-14">
          <H2>Apps we&apos;ve built. Try them.</H2>
          <Lede>Three real apps, rebuilt as demos with made-up names. Tap around as much as you like; nothing you do goes anywhere.</Lede>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {APPS.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.08} className="snap-start shrink-0 w-[82%] sm:w-[60%] md:w-auto">
              <Link href={`/work#${a.id}`} className="group block rounded-xl border border-line bg-canvas overflow-hidden hover:border-line-strong transition-colors">
                <div className="relative h-[400px] flex items-center justify-center overflow-hidden" style={{ background: "radial-gradient(70% 70% at 50% 45%, #FFFFFF 0%, rgba(255,255,255,0) 75%)" }}>
                  <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5">{a.device}</div>
                </div>
                <div className="px-5 pb-5 pt-4 border-t border-line bg-paper">
                  <p className="text-[13px] text-muted">{a.who}</p>
                  <p className="mt-1 text-[18px] font-bold text-heading leading-tight">{a.name}</p>
                  <p className="mt-1.5 text-[15px] text-body leading-snug [text-wrap:pretty]">{a.line}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-heading">
                    Try it <Arrow className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
