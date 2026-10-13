"use client";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/*
 * Carousel 22 (light, 7 slides): "5 signs you've outgrown your spreadsheet."
 * Companion to the spreadsheet reel. The reader counts how many signs sound familiar; the last slide
 * turns the count into the offer. Every visual is a piece of a real-looking spreadsheet (white, the way
 * people know them), so each sign is shown, not described.
 *
 * Motion system, translated to stills (motion-design-system skill):
 * - focus by dimming: a strip of numbered cells (1-5) in spreadsheet column-header style; the current
 *   sign's cell is selected, the rest stay grey;
 * - before -> after: the mess on slides 1-6, the clean app on slide 7, same card system throughout;
 * - one window style on every slide, so swiping reads as one sheet being inspected.
 * Green stays on the final call to action only. All names and amounts are example data.
 */

const W = 1080;
const H = 1350;
const INK = "#101828";

function Shell({ children, cue = false }: { children: ReactNode; cue?: boolean }) {
  return (
    <div data-slide className="relative overflow-hidden bg-[#F3F4F6] text-[#101828]" style={{ width: W, height: H }}>
      <div aria-hidden className="pointer-events-none absolute -right-[260px] -top-[200px] w-[900px] h-[900px] bg-[radial-gradient(closest-side,rgba(205,215,236,0.85),rgba(205,215,236,0))]" />
      <div aria-hidden className="pointer-events-none absolute -left-[300px] bottom-[-260px] w-[1000px] h-[900px] bg-[radial-gradient(closest-side,rgba(186,204,238,0.55),rgba(186,204,238,0))]" />
      {children}
      <footer className="absolute left-[80px] bottom-[56px] flex items-center gap-4">
        <Image src="/mascot.png" alt="" width={1002} height={1530} priority className="h-[72px] w-auto drop-shadow-[0_4px_8px_rgba(16,24,40,0.18)]" />
        <span className="font-extrabold text-[30px] tracking-tight leading-none">Flowrate</span>
      </footer>
      {cue && <span className="absolute right-[80px] bottom-[74px] text-[26px] font-semibold text-[#4A5565]">Swipe →</span>}
    </div>
  );
}

/* Which sign we're on, as a strip of spreadsheet header cells. */
function Tracker({ at }: { at: number }) {
  return (
    <div className="absolute left-[80px] top-[84px] flex rounded-[10px] overflow-hidden ring-1 ring-[#D9DCE1] bg-white">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`w-[62px] h-[46px] flex items-center justify-center text-[21px] font-bold tabular-nums border-r border-[#E5E7EB] last:border-r-0 ${
            n === at ? "bg-[#101828] text-white" : n < at ? "bg-[#F7F7F8] text-[#6A7282]" : "bg-white text-[#B4BAC4]"
          }`}
        >
          {n}
        </span>
      ))}
    </div>
  );
}

function Head({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h1 className={`font-display uppercase text-[82px] leading-[0.96] tracking-[-0.025em] [text-wrap:balance] ${className}`}>{children}</h1>;
}
function Sub({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[31px] leading-[1.42] text-[#4A5565] [text-wrap:pretty] ${className}`}>{children}</p>;
}

/* ------------------------------------------------------------ spreadsheet kit */
type Col = { k: string; w: number; right?: boolean };
type Cell = string | { v: string; bg?: string; color?: string; bold?: boolean };

const LIFT = "[filter:drop-shadow(0_40px_50px_rgba(16,24,40,0.16))_drop-shadow(0_8px_14px_rgba(16,24,40,0.06))]";

function Window({ name, children, style, className = "", fx }: { name: string; children: ReactNode; style?: CSSProperties; className?: string; fx?: ReactNode }) {
  return (
    <div className={`absolute rounded-[24px] bg-white overflow-hidden ring-1 ring-[#E2E5EA] ${LIFT} ${className}`} style={style}>
      <div className="flex items-center gap-3 h-[62px] px-6 bg-[#F7F7F8] border-b border-[#E5E7EB]">
        <span className="w-[32px] h-[32px] rounded-[8px] bg-[#101828] flex items-center justify-center">
          <svg viewBox="0 0 20 20" width="18" height="18"><rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke="#fff" strokeWidth="1.8" /><path d="M3 8h14M3 12.5h14M8 8v9" stroke="#fff" strokeWidth="1.6" /></svg>
        </span>
        <span className="text-[23px] font-semibold tracking-[-0.01em] whitespace-nowrap">{name}</span>
      </div>
      {fx}
      {children}
    </div>
  );
}

function FxBar({ cell, formula, warn = false }: { cell: string; formula: string; warn?: boolean }) {
  return (
    <div className="flex items-center h-[54px] border-b border-[#E5E7EB]">
      <span className="w-[90px] h-full flex items-center justify-center border-r border-[#E5E7EB] font-mono text-[19px] text-[#4A5565]">{cell}</span>
      <span className="w-[54px] text-center italic font-serif text-[21px] text-[#8C95A5]">fx</span>
      <span className={`font-mono text-[19px] whitespace-nowrap ${warn ? "text-[#C2410C]" : "text-[#101828]"}`}>{formula}</span>
    </div>
  );
}

const RN = 52; // row-number column
function Grid({ cols, rows, start = 1, rowH = 54, font = 21, header = true }: { cols: Col[]; rows: Cell[][]; start?: number; rowH?: number; font?: number; header?: boolean }) {
  return (
    <div>
      {header && (
        <div className="flex h-[38px] bg-[#F7F7F8] border-b border-[#E5E7EB] text-[16px] font-semibold text-[#5C6371]">
          <span className="border-r border-[#E5E7EB]" style={{ width: RN }} />
          {cols.map((c, i) => (
            <span key={i} className="flex items-center justify-center border-r border-[#E5E7EB] last:border-r-0" style={{ width: c.w }}>
              {String.fromCharCode(65 + i)}
            </span>
          ))}
        </div>
      )}
      {rows.map((r, ri) => (
        <div key={ri} className="flex border-b border-[#E5E7EB]" style={{ height: rowH }}>
          <span className="flex items-center justify-center bg-[#F7F7F8] border-r border-[#E5E7EB] text-[15px] text-[#6A7282]" style={{ width: RN }}>
            {start + ri}
          </span>
          {cols.map((c, ci) => {
            const cell = r[ci];
            const o = typeof cell === "string" ? { v: cell } : cell || { v: "" };
            return (
              <span
                key={ci}
                className={`flex items-center px-3 border-r border-[#E5E7EB] last:border-r-0 whitespace-nowrap overflow-hidden tabular-nums ${c.right ? "justify-end" : ""}`}
                style={{ width: c.w, fontSize: font, background: o.bg, color: o.color, fontWeight: o.bold || start + ri === 1 ? 700 : 500 }}
              >
                {o.v}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* A collaborator's selection box with its name flag. Coordinates are relative to the grid body. */
function Sel({ who, color, x, y, w, h, flag = "top", inset = 0 }: { who: string; color: string; x: number; y: number; w: number; h: number; flag?: "top" | "bottom"; inset?: number }) {
  return (
    <div className="absolute" style={{ left: x + inset, top: y + inset, width: w - inset * 2, height: h - inset * 2, border: `3px solid ${color}` }}>
      <b
        className="absolute h-[28px] px-2.5 text-[16px] font-bold text-white flex items-center whitespace-nowrap"
        style={{ background: color, left: -3, ...(flag === "top" ? { top: -30, borderRadius: "6px 6px 6px 0" } : { bottom: -30, borderRadius: "0 6px 6px 6px" }) }}
      >
        {who}
      </b>
    </div>
  );
}

const HL = { y: "#FEF08A", p: "#FBCFE8", b: "#BFDBFE", o: "#FED7AA", l: "#DDD6FE", r: "#FECACA" };
const JOBS: [string, string, string, string][] = [
  ["J-0412", "Mara's Bakery", "Done", "1,520.00"],
  ["J-0413", "Hill & Co", "Invoiced", "2,310.00"],
  ["J-0414", "Northgate Gym", "Done", "980.00"],
  ["J-0415", "Bluebird Café", "Booked", "1,260.00"],
  ["J-0416", "Kestrel Dental", "In progress", "3,150.00"],
  ["J-0417", "Oak Lane School", "Booked", "1,140.00"],
  ["J-0418", "Parkside Motors", "Done", "1,680.00"],
];

/* --------------------------------------------------------------------- 1. cover */
function Cover() {
  const cols: Col[] = [{ k: "A", w: 120 }, { k: "B", w: 250 }, { k: "C", w: 170 }, { k: "D", w: 180 }, { k: "E", w: 140, right: true }];
  const tint = [
    [HL.y, HL.p, null, HL.o, null],
    [null, HL.b, HL.y, null, HL.r],
    [HL.l, null, HL.o, HL.r, null],
    [HL.y, HL.p, null, null, HL.b],
    [null, HL.r, HL.y, HL.o, null],
    [HL.b, null, HL.l, HL.r, HL.y],
    [HL.o, HL.y, null, null, HL.p],
  ];
  const rows: Cell[][] = [
    ["Job", "Customer", "Status", "DON'T TOUCH", "Total"].map((v, i) => ({ v, color: i === 3 ? "#C81E1E" : undefined, bold: true })),
    ...JOBS.map((j, ri) => [j[0], j[1], j[2], ri % 3 === 1 ? "ask Sam" : "", j[3]].map((v, ci) => ({ v, bg: tint[ri][ci] ?? undefined, color: ci === 3 ? "#C81E1E" : undefined }))),
  ];
  const tabs = ["Jobs", "Jobs (2)", "Jobs OLD", "Money NEW", "DON'T USE", "Copy of Jobs"];
  return (
    <Shell cue>
      <div className="absolute left-[80px] right-[80px] top-[96px]">
        <Head className="text-[94px] leading-[0.94] [text-wrap:wrap]">5 signs you&apos;ve<br />outgrown your<br />spreadsheet</Head>
        <Sub className="mt-7 text-[36px] text-[#364153]">Count how many sound familiar.</Sub>
      </div>
      <Window name="Jobs_FINAL_v3 (2).xlsx" style={{ left: 64, top: 548, width: 952, transform: "rotate(-2.2deg)" }}>
        <Grid cols={cols} rows={rows} />
        <div className="flex h-[50px] bg-[#F7F7F8] border-t border-[#E5E7EB] text-[18px] font-semibold text-[#5C6371] overflow-hidden">
          <span className="w-[46px] flex items-center justify-center text-[24px] font-normal">+</span>
          {tabs.map((t, i) => (
            <span key={t} className={`px-5 flex items-center whitespace-nowrap ${i === 0 ? "bg-white text-[#101828] shadow-[inset_0_-3px_0_#101828]" : ""}`}>{t}</span>
          ))}
        </div>
      </Window>
    </Shell>
  );
}

/* --------------------------------------------------------- 2. more than one editor */
function Editors() {
  const cols: Col[] = [{ k: "A", w: 128 }, { k: "B", w: 280 }, { k: "C", w: 200 }, { k: "D", w: 260, right: true }];
  const rows: Cell[][] = [["Job", "Customer", "Status", "Total"], ...JOBS.slice(0, 5).map((j, i) => [j[0], j[1], j[2], i === 3 ? { v: "1,620.00", color: "#C2410C", bold: true } : j[3]])];
  const x = (ci: number) => RN + cols.slice(0, ci).reduce((a, c) => a + c.w, 0);
  const y = (r: number) => 38 + (r - 1) * 64;
  return (
    <Shell>
      <Tracker at={1} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>More than one person edits it</Head>
        <Sub className="mt-5">Two people change the same cell at once. One of them wins, and nobody knows which.</Sub>
      </div>
      <Window name="Jobs.xlsx" style={{ left: 80, top: 610, width: 920 }}>
        <div className="relative">
          <Grid cols={cols} rows={rows} rowH={64} font={23} />
          <Sel who="You" color={INK} x={x(1)} y={y(3)} w={cols[1].w} h={64} />
          <Sel who="Sam" color="#2563EB" x={x(3)} y={y(5)} w={cols[3].w} h={64} />
          <Sel who="Lee" color="#EA580C" x={x(3)} y={y(5)} w={cols[3].w} h={64} flag="bottom" inset={6} />
        </div>
      </Window>
      <div className={`absolute left-[300px] top-[1112px] w-[700px] rounded-[18px] bg-[#101828] text-white px-7 py-5 ${LIFT}`}>
        <p className="text-[24px] leading-[1.4]">
          <b className="text-[#93C5FD]">Sam</b> typed 1,260.00 &nbsp;·&nbsp; <b className="text-[#FDBA74]">Lee</b> typed 1,620.00
        </p>
        <p className="text-[21px] text-[#A1A1AA] mt-1">Bluebird Café now says 1,620.00. Is that right?</p>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 3. the copies */
function Copies() {
  const files = [
    ["Jobs.xlsx", "14 Mar", "You"],
    ["Jobs_FINAL.xlsx", "2 Jun", "Sam"],
    ["Jobs_FINAL_v2.xlsx", "9 Aug", "You"],
    ["Jobs_FINAL_v3.xlsx", "Yesterday", "Lee"],
    ["Jobs_FINAL_v3 (2).xlsx", "Today, 08:12", "Sam"],
    ["Copy of Jobs_FINAL_v3.xlsx", "Today, 09:40", "Lee"],
  ];
  return (
    <Shell>
      <Tracker at={2} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>There&apos;s a file called FINAL_v3 (2)</Head>
        <Sub className="mt-5">And a few more like it. Nobody is quite sure which copy is the real one.</Sub>
      </div>
      <div className={`absolute left-[80px] top-[600px] w-[920px] rounded-[24px] bg-white overflow-hidden ring-1 ring-[#E2E5EA] ${LIFT}`}>
        <div className="flex items-center h-[56px] px-7 bg-[#F7F7F8] border-b border-[#E5E7EB] text-[18px] font-semibold text-[#6A7282]">
          <span className="flex-1">Name</span>
          <span className="w-[200px]">Edited</span>
          <span className="w-[90px] text-right">By</span>
        </div>
        {files.map(([n, d, by], i) => {
          const pick = i === 4;
          return (
            <div key={n} className={`flex items-center h-[78px] px-7 border-b border-[#F0F1F3] last:border-b-0 ${pick ? "bg-[#FFF7ED]" : ""}`}>
              <span className="w-[34px] h-[40px] mr-5 rounded-[6px] bg-[#EEF0F3] ring-1 ring-[#DDE1E6] flex items-end justify-center pb-1">
                <span className="text-[10px] font-bold text-[#6A7282]">XLS</span>
              </span>
              <span className={`flex-1 text-[25px] whitespace-nowrap ${pick ? "font-bold" : "font-medium"}`}>{n}</span>
              <span className="w-[200px] text-[21px] text-[#6A7282]">{d}</span>
              <span className="w-[90px] text-right text-[21px] text-[#6A7282]">{by}</span>
            </div>
          );
        })}
      </div>
      <div className={`absolute right-[64px] top-[1046px] rounded-[16px] bg-[#101828] text-white px-6 h-[68px] flex items-center gap-3 text-[25px] font-semibold rotate-[2deg] ${LIFT}`}>
        <span className="w-[34px] h-[34px] rounded-[9px] bg-[#EA580C] flex items-center justify-center font-extrabold">?</span>
        Which one is the real one?
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- 4. do not touch */
function DoNotTouch() {
  const cols: Col[] = [{ k: "A", w: 300 }, { k: "B", w: 290, right: true }, { k: "C", w: 278, right: true }];
  const red = "rgba(252,165,165,0.42)";
  const rows: Cell[][] = [
    ["Customer", { v: "DO NOT TOUCH", color: "#C81E1E", bg: "#FEE2E2", bold: true }, "Total"],
    ...JOBS.slice(0, 6).map((j) => [j[1], { v: "1.15", bg: red }, j[3]]),
  ];
  return (
    <Shell>
      <Tracker at={3} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>There&apos;s a column nobody&apos;s allowed to touch</Head>
        <Sub className="mt-5">Because only one person knows how it works. And they&apos;re on leave.</Sub>
      </div>
      <Window name="Jobs.xlsx" style={{ left: 80, top: 650, width: 920 }} fx={<FxBar cell="B3" formula={`=IFERROR(VLOOKUP(A3,'Rates OLD'!A:F,6,0)*1.15,"")`} />}>
        <div className="relative">
          <Grid cols={cols} rows={rows} rowH={56} font={23} />
          <div className="absolute top-[38px] bottom-0 border-x-[3px] border-[#F87171]" style={{ left: RN + cols[0].w, width: cols[1].w }} />
          <svg className="absolute" style={{ left: RN + cols[0].w + 16, top: 38 + 17 }} viewBox="0 0 20 20" width="22" height="22"><path d="M6 9V6.5a4 4 0 0 1 8 0V9" fill="none" stroke="#C81E1E" strokeWidth="2" /><rect x="4.5" y="9" width="11" height="8" rx="2" fill="#C81E1E" /></svg>
          <i className="absolute w-0 h-0 border-t-[14px] border-t-[#EA580C] border-l-[14px] border-l-transparent" style={{ left: RN + cols[0].w + cols[1].w - 14, top: 38 + 56 * 2 }} />
        </div>
      </Window>
      <div className={`absolute left-[560px] top-[960px] w-[400px] rounded-[14px] bg-[#FFFBEB] ring-1 ring-[#FCD34D] px-6 py-4 ${LIFT}`}>
        <p className="text-[18px] font-bold text-[#92400E]">Sam · comment</p>
        <p className="text-[25px] leading-[1.3] mt-1 text-[#3B2F0B]">Ask me before changing this!!</p>
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- 5. typed twice */
function TypedTwice() {
  return (
    <Shell>
      <Tracker at={4} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>The same numbers get typed in twice</Head>
        <Sub className="mt-5">Into the sheet, then the invoice, then the accounts. Sooner or later, one gets it wrong.</Sub>
      </div>
      {/* 1. the sheet */}
      <div className={`absolute left-[80px] top-[630px] w-[620px] rounded-[20px] bg-white overflow-hidden ring-1 ring-[#E2E5EA] ${LIFT}`}>
        <p className="h-[52px] px-6 flex items-center gap-3 bg-[#F7F7F8] border-b border-[#E5E7EB] text-[19px] font-semibold text-[#4A5565]">
          <span className="w-[30px] h-[30px] rounded-[8px] bg-[#101828] text-white text-[16px] flex items-center justify-center font-bold">1</span>Jobs.xlsx
        </p>
        <div className="flex items-center h-[78px] px-6 text-[26px]">
          <span className="w-[130px] text-[#6A7282] text-[22px]">J-0415</span>
          <span className="flex-1 font-semibold">Bluebird Café</span>
          <span className="font-semibold tabular-nums">1,260.00</span>
        </div>
      </div>
      {/* 2. the invoice */}
      <div className={`absolute left-[240px] top-[800px] w-[620px] rounded-[20px] bg-white overflow-hidden ring-1 ring-[#E2E5EA] ${LIFT}`}>
        <p className="h-[52px] px-6 flex items-center gap-3 bg-[#F7F7F8] border-b border-[#E5E7EB] text-[19px] font-semibold text-[#4A5565]">
          <span className="w-[30px] h-[30px] rounded-[8px] bg-[#101828] text-white text-[16px] flex items-center justify-center font-bold">2</span>Invoice INV-2207
        </p>
        <div className="flex items-center h-[78px] px-6 text-[26px]">
          <span className="flex-1 font-semibold">Bluebird Café · repair</span>
          <span className="font-semibold tabular-nums">1,260.00</span>
        </div>
      </div>
      {/* 3. the accounts, typed wrong */}
      <div className={`absolute left-[400px] top-[970px] w-[600px] rounded-[20px] bg-white overflow-hidden ring-2 ring-[#F87171] ${LIFT}`}>
        <p className="h-[52px] px-6 flex items-center gap-3 bg-[#FEF2F2] border-b border-[#FECACA] text-[19px] font-semibold text-[#4A5565]">
          <span className="w-[30px] h-[30px] rounded-[8px] bg-[#101828] text-white text-[16px] flex items-center justify-center font-bold">3</span>Accounts
        </p>
        <div className="flex items-center h-[78px] px-6 text-[26px]">
          <span className="flex-1 font-semibold">Bluebird Café</span>
          <span className="font-bold tabular-nums text-[#C81E1E] decoration-[#C81E1E] underline decoration-wavy underline-offset-[6px]">1,206.00</span>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------- 6. nobody trusts it */
function Untrusted() {
  const cols: Col[] = [{ k: "A", w: 470 }, { k: "B", w: 398, right: true }];
  const body = JOBS.slice(2, 7).map((j) => [j[1], j[3]] as Cell[]);
  const rows: Cell[][] = [...body, ["", ""], [{ v: "Total", bold: true }, { v: "1,200.00", bold: true, color: "#C2410C" }]];
  return (
    <Shell>
      <Tracker at={5} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>Nobody trusts the total</Head>
        <Sub className="mt-5">Someone typed a number over the formula, so it stopped adding up. Now it gets checked by hand.</Sub>
      </div>
      <Window name="Jobs.xlsx" style={{ left: 80, top: 640, width: 920 }} fx={<FxBar cell="B12" formula="1200" warn />}>
        <div className="relative">
          <Grid cols={cols} rows={rows} start={6} rowH={58} font={24} />
          <div className="absolute border-[3px] border-[#EA580C]" style={{ left: RN + cols[0].w, top: 38 + 58 * 6, width: cols[1].w, height: 58 }} />
          <i className="absolute w-0 h-0 border-t-[16px] border-t-[#EA580C] border-r-[16px] border-r-transparent" style={{ left: RN + cols[0].w + 3, top: 38 + 58 * 6 + 3 }} />
        </div>
      </Window>
      <div className={`absolute left-[150px] top-[1088px] h-[50px] rounded-[12px] bg-[#101828] text-white px-5 flex items-center ${LIFT}`}>
        <p className="text-[22px] leading-none">
          Should be <b className="tabular-nums">8,210.00</b>. It says <b className="text-[#FDBA74] tabular-nums">1,200.00</b>.
        </p>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------- 7. the offer */
function Offer() {
  const chip: Record<string, string> = { Done: "bg-[#EAF8E6] text-[#1D6B2B]", Invoiced: "bg-[#EEF2F7] text-[#334155]", Booked: "bg-[#FEF3C7] text-[#92400E]", "In progress": "bg-[#E6EEFB] text-[#1E4FB8]" };
  return (
    <Shell>
      <div className="absolute left-[80px] right-[80px] top-[96px]">
        <Head className="text-[92px]">Nodded at two or more?</Head>
        <Sub className="mt-6">
          That&apos;s when a spreadsheet starts running you. We turn it into one simple app, built around how you
          already work. If yours still does the job, we&apos;ll tell you to keep it.
        </Sub>
      </div>
      <div className={`absolute left-[80px] top-[560px] w-[920px] rounded-[24px] bg-[#F7F8FA] overflow-hidden ring-1 ring-[#E2E5EA] ${LIFT}`}>
        <div className="flex items-center justify-between h-[72px] px-6 bg-white border-b border-[#EEF0F2]">
          <span className="flex items-center gap-3 text-[27px] font-bold tracking-[-0.02em]">
            <Image src="/mascot.png" alt="" width={1002} height={1530} className="h-[44px] w-auto" />Jobs
          </span>
          <span className="h-[46px] px-5 rounded-[12px] bg-[#101828] text-white text-[20px] font-bold flex items-center">+ New job</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="rounded-[18px] bg-[#101828] text-white h-[104px] px-6 flex items-center justify-between">
            <div>
              <p className="text-[18px] font-semibold text-[#98A2B3]">Total, all jobs</p>
              <p className="text-[44px] font-extrabold tracking-[-0.02em] tabular-nums leading-tight">18,640.00</p>
            </div>
            <span className="h-[42px] px-4 rounded-full bg-white text-[#101828] text-[19px] font-bold flex items-center gap-2">
              <svg viewBox="0 0 20 20" width="18" height="18"><path d="M6 9V6.5a4 4 0 0 1 8 0V9" fill="none" stroke="#101828" strokeWidth="2" /><rect x="4.5" y="9" width="11" height="8" rx="2" fill="#101828" /></svg>
              Adds itself up
            </span>
          </div>
          {[["Harbour Florist", "J-0422", "Booked", "1,250.00"], ...JOBS.slice(0, 2).map((j) => [j[1], j[0], j[2], j[3]])].map(([n, id, st, tot]) => (
            <div key={id} className="rounded-[16px] bg-white ring-1 ring-[#E8EAEE] h-[84px] px-6 flex items-center">
              <div className="flex-1">
                <p className="text-[24px] font-semibold leading-tight">{n}</p>
                <p className="text-[18px] text-[#6A7282]">{id}</p>
              </div>
              <span className={`rounded-full px-4 h-[34px] flex items-center text-[18px] font-medium mr-8 ${chip[st]}`}>{st}</span>
              <span className="w-[140px] text-right text-[24px] font-semibold tabular-nums">{tot}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-[80px] top-[1108px] flex items-center gap-6">
        <span className="inline-flex items-center gap-3 rounded-[14px] bg-[#99E58C] text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[28px] px-9 h-[84px] [filter:drop-shadow(0_14px_22px_rgba(29,107,43,0.2))]">
          Book a free call →
        </span>
        <span className="text-[26px] text-[#4A5565]">flowrate.agency · link in bio</span>
      </div>
    </Shell>
  );
}

const SLIDES = [
  { slug: "slide-01-five-signs", node: <Cover /> },
  { slug: "slide-02-more-than-one-person", node: <Editors /> },
  { slug: "slide-03-final-v3", node: <Copies /> },
  { slug: "slide-04-do-not-touch", node: <DoNotTouch /> },
  { slug: "slide-05-typed-twice", node: <TypedTwice /> },
  { slug: "slide-06-nobody-trusts-the-total", node: <Untrusted /> },
  { slug: "slide-07-two-or-more", node: <Offer /> },
];

export function Carousel22({ s }: { s?: string }) {
  const i = Number(s);
  if (i >= 1 && i <= SLIDES.length) return <>{SLIDES[i - 1].node}</>;
  return (
    <div className="flex flex-wrap gap-10 p-10">
      {SLIDES.map((sl) => <div key={sl.slug}>{sl.node}</div>)}
    </div>
  );
}
