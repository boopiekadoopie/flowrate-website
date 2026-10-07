"use client";
import type { ReactNode } from "react";
import { Dashboard, DeliveryNote, Invoice, Phone } from "@/components/HeroStage";
import { Slide, Scaled } from "../Slide";

/*
 * Carousel 19: "Six places to look. Or one."
 * The question fans out to six places (1), each holds one piece (2), the gap nobody sees (3),
 * the six drain into one system (4), the same question answered in one look (5), the offer (6).
 * Every graphic is a still frame of the website's own UI and motion language.
 */

const FINAL = 17;

function Icon({ children, className = "w-9 h-9" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

function Tick({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SOURCES: { label: string; icon: ReactNode }[] = [
  { label: "WhatsApp", icon: <path d="M3 13l1-3.2A6 6 0 1 1 6.6 12L3 13z" /> },
  { label: "Spreadsheets", icon: <><rect x="2.5" y="2.5" width="11" height="11" rx="1.5" /><path d="M2.5 6.5h11M2.5 10h11M6.5 2.5v11" /></> },
  { label: "Paper", icon: <><path d="M4 2.5h5.5l2.5 2.5v8.5H4z" /><path d="M6 8h4M6 10.5h3" /></> },
  { label: "Email", icon: <><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="M2.5 4.5L8 8.5l5.5-4" /></> },
  { label: "Calls", icon: <path d="M4.5 2.5l2 .5.8 2.7-1.4 1a7 7 0 0 0 3.4 3.4l1-1.4 2.7.8.5 2a1.6 1.6 0 0 1-1.7 1.5A10.5 10.5 0 0 1 3 4.2 1.6 1.6 0 0 1 4.5 2.5z" /> },
  { label: "Memory", icon: <><path d="M3 2.5h10v8l-3 3H3z" /><path d="M10 13.5v-3h3" /></> },
];

/* A frozen frame of the site's travelling streak: a short gradient segment on a wire. */
function Streak({ d, at, len = 0.18, id }: { d: string; at: number; len?: number; id: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth="4"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={`${len} 1`}
      strokeDashoffset={-at}
      style={{ filter: "drop-shadow(0 0 6px rgba(153,229,140,0.85))" }}
    />
  );
}

function StreakGrad({ id, h }: { id: string; h: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={h}>
      <stop offset="0" stopColor="#99E58C" />
      <stop offset="1" stopColor="#1D6B2B" />
    </linearGradient>
  );
}

/* ------------------------------------------------------------------ 1. cover */

const FW = 920;
const FH = 680;
const tileX = (i: number) => 70 + i * 156; // tile centres
function FanOut() {
  const from = { x: FW / 2, y: 196 };
  const paths = SOURCES.map((_, i) => {
    const x = tileX(i);
    const sx = from.x - 150 + i * 60; // each wire leaves the card at its own point, no knot of dashes
    return `M ${sx} ${from.y} C ${sx} ${from.y + 130}, ${x} ${490 - 150}, ${x} 490`;
  });
  return (
    <div className="relative" style={{ width: FW, height: FH }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden>
        <defs><StreakGrad id="fan" h={FH} /></defs>
        {paths.map((d) => <path key={d} d={d} fill="none" stroke="#C9CDD3" strokeWidth="2" strokeDasharray="3 7" />)}
        {paths.map((d, i) => <Streak key={`s${i}`} d={d} at={[0.55, 0.3, 0.7, 0.42, 0.62, 0.36][i]} id="fan" />)}
      </svg>

      {/* the customer's question */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[720px] rounded-[24px] rounded-tl-[6px] bg-white border border-line px-9 py-7 [filter:drop-shadow(0_26px_30px_rgba(16,24,40,0.16))_drop-shadow(0_6px_10px_rgba(16,24,40,0.08))]">
        <p className="flex justify-between text-[20px] text-muted">
          <span className="font-semibold text-heading">Northline Supply</span>
          <span className="tabular-nums">08:12</span>
        </p>
        <p className="mt-2.5 text-[33px] leading-[1.3] text-heading">Morning. Has Tuesday’s delivery been invoiced yet? Need it for month-end.</p>
      </div>

      {/* six places to check */}
      {SOURCES.map((s, i) => (
        <div
          key={s.label}
          className="absolute -translate-x-1/2 top-[490px] w-[140px] h-[170px] rounded-[16px] border border-line bg-white flex flex-col items-center justify-center gap-3 shadow-[0_18px_34px_-22px_rgba(16,24,40,0.35)]"
          style={{ left: tileX(i) }}
        >
          <span className="text-[#6A7282]"><Icon className="w-10 h-10">{s.icon}</Icon></span>
          <span className="text-[20px] font-semibold text-heading leading-none">{s.label === "Spreadsheets" ? "Sheets" : s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 2. the pieces */

function ChatPiece() {
  return (
    <div className="w-[232px] rounded-[16px] rounded-tl-[5px] bg-white border border-line p-2 shadow-[0_16px_30px_-16px_rgba(16,24,40,0.35)] rotate-[-2deg]">
      <div className="rounded-[10px] bg-[#EFEFEB] h-[104px] flex items-center justify-center overflow-hidden">
        <div className="translate-y-6"><DeliveryNote t={0} held={false} scanning={false} width={96} tilt={-5} /></div>
      </div>
      <p className="text-[16px] text-heading px-1 pt-2 leading-snug">POD for 2417. No signal at the mill</p>
      <p className="text-[13px] text-faint px-1 text-right tabular-nums">Tue 18:06</p>
    </div>
  );
}

function SheetPiece() {
  const rows = [["2415", "27 880", "INV-0188"], ["2416", "29 040", "INV-0189"], ["2417", "28 460", ""]];
  return (
    <div className="w-[244px] bg-white border border-line rounded-[8px] overflow-hidden text-[15px] shadow-[0_16px_30px_-16px_rgba(16,24,40,0.3)]">
      <div className="grid grid-cols-[58px_1fr_92px] bg-[#F7F7F7] text-muted border-b border-line">
        {["Load", "Net kg", "Invoice"].map((h) => <span key={h} className="px-2.5 py-2 border-r border-line last:border-0">{h}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="grid grid-cols-[58px_1fr_92px] border-b border-[#F0F0F0] last:border-0 tabular-nums">
          <span className="px-2.5 py-2 border-r border-[#F0F0F0] text-muted">{r[0]}</span>
          <span className="px-2.5 py-2 border-r border-[#F0F0F0] text-heading">{r[1]}</span>
          <span className={`px-2.5 py-2 ${r[2] ? "text-muted" : "bg-hold-bg"}`}>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function MailPiece() {
  return (
    <div className="w-[248px] rounded-[10px] bg-white border border-line px-4 py-3.5 shadow-[0_16px_30px_-16px_rgba(16,24,40,0.3)] rotate-[1.5deg]">
      <div className="flex justify-between text-[13px] text-faint"><span>Accounts</span><span className="tabular-nums">Wed 09:14</span></div>
      <p className="text-[16px] font-semibold text-heading mt-1 leading-snug">Re: Fwd: weights for 2417?</p>
      <p className="text-[15px] text-body mt-1 leading-snug">Which number do I bill, the ticket or the delivery note?</p>
    </div>
  );
}

function CallsPiece() {
  const rows = [
    { who: "Driver", what: "Missed call", t: "17:51", missed: true },
    { who: "Driver", what: "Outgoing · 1 min", t: "18:02" },
    { who: "Northline", what: "Incoming · 4 min", t: "Wed 08:30" },
  ];
  return (
    <div className="w-[244px] rounded-[12px] bg-white border border-line overflow-hidden shadow-[0_16px_30px_-16px_rgba(16,24,40,0.3)]">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[#F0F0F0] last:border-0">
          <span className={r.missed ? "text-[#B42318]" : "text-faint"}><Icon className="w-4 h-4">{SOURCES[4].icon}</Icon></span>
          <span className="flex-1 min-w-0">
            <span className={`block text-[15px] font-semibold leading-tight ${r.missed ? "text-[#B42318]" : "text-heading"}`}>{r.who}</span>
            <span className="block text-[13px] text-muted leading-tight">{r.what}</span>
          </span>
          <span className="text-[13px] text-faint tabular-nums">{r.t}</span>
        </div>
      ))}
    </div>
  );
}

function StickyPiece() {
  return (
    <div className="w-[176px] h-[164px] bg-[#FDF1A8] p-4 shadow-[0_16px_28px_-14px_rgba(120,90,10,0.45)] text-[#4A3B07] rotate-[3deg]">
      <p className="text-[19px] leading-[1.3] font-semibold">2417 invoiced?? I think so</p>
      <p className="text-[16px] mt-3 opacity-70">ask the office</p>
    </div>
  );
}

const PIECES: { art: ReactNode; name: string; has: string }[] = [
  { art: <ChatPiece />, name: "WhatsApp", has: "has the photo" },
  { art: <SheetPiece />, name: "The spreadsheet", has: "has the weight" },
  { art: <DeliveryNote t={0} held={false} scanning={false} width={136} tilt={-3} />, name: "The paper", has: "has the signature" },
  { art: <MailPiece />, name: "Email", has: "has the question" },
  { art: <CallsPiece />, name: "The calls", has: "have the update" },
  { art: <StickyPiece />, name: "Someone’s memory", has: "has a guess" },
];

function Pieces() {
  return (
    <div className="grid grid-cols-3 gap-5 w-full">
      {PIECES.map((p) => (
        <div key={p.name} className="rounded-[18px] bg-canvas border border-line overflow-hidden flex flex-col">
          <div className="h-[244px] flex items-center justify-center"><div style={{ zoom: 1.12 }}>{p.art}</div></div>
          <div className="px-5 pb-5 pt-1">
            <p className="text-[24px] font-bold text-heading leading-tight">{p.name}</p>
            <p className="text-[22px] text-muted leading-tight mt-1">{p.has}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 3. the gap */

const LEDGER = [
  ["2410", "02/10", "Kaya Building", "27 120", "INV-0183"],
  ["2411", "02/10", "Harbour Foods", "29 400", "INV-0184"],
  ["2412", "03/10", "Ridge Farms", "26 760", "INV-0185"],
  ["2413", "05/10", "Oakline Joinery", "28 900", "INV-0186"],
  ["2414", "05/10", "Harbour Foods", "27 640", "INV-0187"],
  ["2415", "05/10", "Kaya Building", "27 880", "INV-0188"],
  ["2416", "06/10", "Ridge Farms", "29 040", "INV-0189"],
  ["2417", "06/10", "Northline Supply", "28 460", ""],
  ["2418", "07/10", "Oakline Joinery", "27 300", "INV-0190"],
  ["2419", "07/10", "Kaya Building", "28 120", "INV-0191"],
];
const COLS = "64px 124px 110px 1fr 150px 190px";

function Ledger() {
  return (
    <div className="relative w-full rounded-[14px] bg-white border border-line overflow-hidden shadow-[0_50px_90px_-44px_rgba(16,24,40,0.4),0_18px_36px_-22px_rgba(16,24,40,0.2)] text-[21px]">
      <div className="h-[58px] flex items-center gap-4 px-6 border-b border-line bg-[#FCFCFC]">
        <span className="font-semibold text-heading">Loads 2026.xlsx</span>
        <span className="ml-auto flex gap-1.5 text-[17px]">
          {["Oct", "Sep", "Aug"].map((m, i) => (
            <span key={m} className={`px-3 py-1 rounded-[6px] ${i === 0 ? "bg-white border border-line text-heading font-semibold" : "text-faint"}`}>{m}</span>
          ))}
        </span>
      </div>
      <div className="grid bg-[#F7F7F7] text-faint text-[16px] border-b border-line" style={{ gridTemplateColumns: COLS }}>
        {["", "A", "B", "C", "D", "E"].map((c, i) => <span key={i} className="py-1.5 text-center border-r border-line last:border-0">{c}</span>)}
      </div>
      <div className="grid text-muted text-[17px] font-semibold border-b border-line" style={{ gridTemplateColumns: COLS }}>
        {["1", "Load", "Date", "Customer", "Net kg", "Invoice"].map((c, i) => (
          <span key={i} className={`py-3 border-r border-line last:border-0 ${i === 0 ? "text-center bg-[#F7F7F7] text-faint font-normal" : "px-3.5"}`}>{c}</span>
        ))}
      </div>
      {LEDGER.map((r, ri) => {
        const gap = r[4] === "";
        return (
          <div key={r[0]} className="grid border-b border-[#F0F0F0] last:border-0 tabular-nums" style={{ gridTemplateColumns: COLS }}>
            <span className="py-[11px] text-center bg-[#F7F7F7] text-faint text-[16px] border-r border-line">{ri + 2}</span>
            {r.map((c, ci) => (
              <span
                key={ci}
                className={`py-[11px] px-3.5 border-r border-[#F0F0F0] last:border-0 truncate ${ci === 4 ? "text-muted" : "text-heading"} ${gap && ci === 4 ? "bg-hold-bg outline outline-[3px] -outline-offset-[3px] outline-[#D97706]" : ""}`}
              >
                {c}
              </span>
            ))}
          </div>
        );
      })}
      {/* a spreadsheet comment hanging off the empty cell, like someone finally noticed */}
      <div className="absolute right-[190px] top-[584px] w-[300px] rounded-[10px] bg-[#1F1F1F] text-white px-5 py-4 shadow-[0_22px_36px_-16px_rgba(16,24,40,0.6)]">
        <p className="text-[20px] font-semibold leading-tight">Delivered 6 Oct.</p>
        <p className="text-[20px] text-[#FCD34D] leading-tight mt-0.5">Never billed.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 4. one system */

const CW = 920;
const CH = 640;
const TRAY_B = 172;
const CORE = { x: 300, y: 300, w: 320, h: 120 };
const OUT_Y = 512;
const OUTS = ["Jobs board", "Draft invoices", "Reports", "Customer answers"];
const trayX = (i: number) => 153 + (i % 3) * 307;
const outX = (i: number) => 107 + i * 235;
const inP = SOURCES.map((_, i) => {
  const x = trayX(i);
  const tx = CORE.x + 40 + (i * (CORE.w - 80)) / (SOURCES.length - 1);
  return `M ${x} ${TRAY_B} C ${x} ${TRAY_B + 70}, ${tx} ${CORE.y - 60}, ${tx} ${CORE.y}`;
});
const outP = OUTS.map((_, i) => {
  const sx = CORE.x + 50 + (i * (CORE.w - 100)) / (OUTS.length - 1);
  const by = CORE.y + CORE.h;
  return `M ${sx} ${by} C ${sx} ${by + 50}, ${outX(i)} ${OUT_Y - 50}, ${outX(i)} ${OUT_Y}`;
});

function OneSystem() {
  return (
    <div className="relative" style={{ width: CW, height: CH }}>
      <svg viewBox={`0 0 ${CW} ${CH}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden>
        <defs><StreakGrad id="conv" h={CH} /></defs>
        {inP.map((d) => <path key={d} d={d} fill="none" stroke="#C9CDD3" strokeWidth="2" />)}
        {outP.map((d) => <path key={d} d={d} fill="none" stroke="#101828" strokeWidth="2" />)}
        {inP.map((d, i) => <Streak key={`a${i}`} d={d} at={[0.5, 0.25, 0.62, 0.38, 0.7, 0.45][i]} len={0.22} id="conv" />)}
        {outP.map((d, i) => <Streak key={`b${i}`} d={d} at={[0.4, 0.6, 0.3, 0.55][i]} len={0.26} id="conv" />)}
      </svg>

      <div className="absolute inset-x-0 top-0 rounded-[16px] border border-line bg-white p-3 grid grid-cols-3 gap-2.5" style={{ height: TRAY_B }}>
        {SOURCES.map((s) => (
          <div key={s.label} className="flex items-center justify-center gap-2.5 rounded-[10px] bg-canvas text-body">
            <span className="text-faint"><Icon className="w-7 h-7">{s.icon}</Icon></span>
            <span className="text-[24px]">{s.label}</span>
          </div>
        ))}
      </div>

      <div
        className="absolute rounded-[18px] bg-carbon text-white flex flex-col items-center justify-center shadow-[0_30px_50px_-20px_rgba(16,24,40,0.55)]"
        style={{ left: CORE.x, top: CORE.y, width: CORE.w, height: CORE.h }}
      >
        <span className="absolute inset-2.5 rounded-[12px] border border-white/10" aria-hidden />
        <span className="absolute inset-0 rounded-[18px] bg-[linear-gradient(160deg,rgba(255,255,255,0.12),transparent_45%)]" aria-hidden />
        <span className="font-display uppercase text-[32px] leading-none tracking-[-0.01em]">Your system</span>
        <span className="text-[21px] text-white/60 mt-2.5">Entered once</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 gap-4" style={{ top: OUT_Y }}>
        {OUTS.map((o) => (
          <div key={o} className="rounded-[14px] border border-line bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06)] px-4 py-4 flex flex-col justify-between">
            <span className="text-ok"><Tick className="w-6 h-6" /></span>
            <p className="text-[22px] font-semibold text-heading leading-[1.15]">{o}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 5. one look */

function OneLook() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute left-[-40px] top-0">
        <Scaled k={1.16} w={840} h={560}><Dashboard t={FINAL} held={false} /></Scaled>
      </div>
      <div className="absolute left-[-40px] bottom-[-8px]">
        <Scaled k={1.42} w={262} h={250}><Invoice t={FINAL} held={false} /></Scaled>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 6. the offer */

const BUILDS = ["Admin systems", "Driver & field apps", "Reporting", "Websites"];

function Offer() {
  return (
    <div className="w-full h-full flex items-center gap-14">
      {/* the phone's own 80px shadow tiles badly in headless Chrome at 3x, so it gets a drop-shadow instead */}
      <div className="flex-shrink-0 [&>div>div>div]:!shadow-none [filter:drop-shadow(0_36px_36px_rgba(16,24,40,0.32))_drop-shadow(0_10px_14px_rgba(16,24,40,0.2))]">
        <Scaled k={1.2} w={230} h={456}><Phone t={FINAL} /></Scaled>
      </div>
      <div className="flex-1 min-w-0">
        <ul className="divide-y divide-line border-y border-line">
          {BUILDS.map((b) => (
            <li key={b} className="flex items-center gap-4 py-[18px] text-[30px] font-semibold text-heading">
              <span className="text-ok"><Tick className="w-7 h-7" /></span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-7 text-[25px] leading-[1.4] text-body">If a spreadsheet does the job, we’ll say so.</p>
        <span className="mt-8 inline-flex items-center gap-3 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[24px] px-8 py-5 rounded-[12px]">
          Book a free call
          <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6" aria-hidden><path d="M3 10h13m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <p className="mt-4 text-[22px] text-muted">flowrate.agency</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ slides */

const SLIDES: { slug: string; node: ReactNode }[] = [
  {
    slug: "cover",
    node: (
      <Slide wash title="Six places to look. Or one." sub="A customer asks if their delivery has been invoiced. In most businesses, the answer is spread across six places.">
        <FanOut />
      </Slide>
    ),
  },
  {
    slug: "the-pieces",
    node: (
      <Slide title="The answer is in there. In pieces." sub="Every place holds one part of the story. Not one of them says “invoiced”.">
        <Pieces />
      </Slide>
    ),
  },
  {
    slug: "the-gap",
    node: (
      <Slide canvas title="A missed invoice doesn’t announce itself." sub="It’s one blank cell among hundreds. You find it when a customer’s month looks light, if anyone checks.">
        <Ledger />
      </Slide>
    ),
  },
  {
    slug: "one-system",
    node: (
      <Slide title="Put it in once. Read it everywhere." sub="The phone and the office feed one system. The invoice, the report and the customer’s answer all come out of it.">
        <OneSystem />
      </Slide>
    ),
  },
  {
    slug: "one-look",
    node: (
      <Slide wash title="Same question. One look." sub="Delivered, read, weights checked on all three pages, and a draft invoice waiting for your OK.">
        <OneLook />
      </Slide>
    ),
  },
  {
    slug: "we-build-it",
    node: (
      <Slide canvas title="We build that one place." sub="Around the way your business already runs, by people who had to do the job by hand first.">
        <Offer />
      </Slide>
    ),
  },
];

/* ?s=1..6 renders one slide alone; anything else lays the whole set out for review. */
export function Carousel19({ s }: { s?: string }) {
  const i = Number(s);
  if (i >= 1 && i <= SLIDES.length) return <>{SLIDES[i - 1].node}</>;
  return (
    <div className="flex flex-wrap gap-10 p-10">
      {SLIDES.map((sl) => <div key={sl.slug}>{sl.node}</div>)}
    </div>
  );
}
