"use client";
import Image from "next/image";
import type { ReactNode } from "react";

/*
 * Carousel 21 (dark, 5 slides): "Three questions you can't answer on a Friday."
 * A test the reader takes on themselves: what isn't invoiced, who's doing what, who owes you.
 * Each question slide shows the mess it lives in today (chat messages, a sticky note) with one clean
 * screen landing on top that answers it in a single look.
 *
 * Motion system, translated to stills (see the motion-design-system skill):
 * - focus by dimming: a three-question tracker; the current question is bright, the rest dim;
 * - before -> after in one frame: the answer card overlaps and covers the mess behind it;
 * - one card system on every slide, so swiping reads as one sequence advancing.
 * Green stays on the final call to action only. All names and amounts are example data.
 */

const W = 1080;
const H = 1350;
const QUESTIONS = ["What hasn’t been invoiced yet?", "Who’s doing what today?", "Who still owes you money?"];

function Shell({ children, cue = false }: { children: ReactNode; cue?: boolean }) {
  return (
    <div data-slide className="relative overflow-hidden bg-[#0B0B0C] text-[#F4F4F5]" style={{ width: W, height: H }}>
      <div aria-hidden className="pointer-events-none absolute -top-[25%] -left-[15%] w-[900px] h-[900px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)]" />
      {children}
      <footer className="absolute left-[80px] bottom-[56px] flex items-center gap-4">
        <Image src="/mascot.png" alt="" width={1002} height={1530} priority className="h-[72px] w-auto" />
        <span className="font-extrabold text-[30px] tracking-tight leading-none">Flowrate</span>
      </footer>
      {cue && <span className="absolute right-[80px] bottom-[74px] text-[26px] font-semibold text-[#A1A1AA]">Swipe →</span>}
    </div>
  );
}

/* The three questions as a rolling list: the current one bright, the others dimmed. */
function Tracker({ at }: { at: number }) {
  return (
    <ol className="absolute left-[80px] top-[84px] flex gap-3">
      {QUESTIONS.map((q, i) => (
        <li
          key={q}
          className={`flex items-center gap-2.5 rounded-full px-4 h-[46px] text-[21px] font-semibold border ${
            i === at ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-white/40"
          }`}
        >
          <span className="tabular-nums">{i + 1}</span>
          {i === at && <span className="text-[19px] font-medium text-[#4A5565]">of 3</span>}
        </li>
      ))}
    </ol>
  );
}

function Head({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h1 className={`font-display uppercase text-[84px] leading-[0.96] tracking-[-0.025em] [text-wrap:balance] ${className}`}>{children}</h1>;
}
function Sub({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[31px] leading-[1.42] text-[#A1A1AA] [text-wrap:pretty] ${className}`}>{children}</p>;
}

/* A message from the team group chat, as it looks today. */
function Bubble({ who, text, time, x, y, rot = 0, w = 470 }: { who: string; text: string; time: string; x: number; y: number; rot?: number; w?: number }) {
  return (
    <div
      className="absolute rounded-[22px] rounded-tl-[6px] bg-[#1F1F22] ring-1 ring-white/10 px-6 py-4 [filter:drop-shadow(0_24px_30px_rgba(0,0,0,0.55))]"
      style={{ left: x, top: y, width: w, transform: `rotate(${rot}deg)` }}
    >
      <p className="text-[19px] font-semibold text-[#8E8E96] mb-1">{who}</p>
      <p className="text-[26px] leading-[1.3] text-[#E4E4E7]">{text}</p>
      <p className="text-[17px] text-[#6B6B73] text-right mt-1 tabular-nums">{time}</p>
    </div>
  );
}

function Sticky({ text, x, y, rot }: { text: string; x: number; y: number; rot: number }) {
  return (
    <div
      className="absolute w-[230px] h-[200px] bg-[#FDE68A] text-[#3B2F0B] p-5 [filter:drop-shadow(0_20px_24px_rgba(0,0,0,0.5))]"
      style={{ left: x, top: y, transform: `rotate(${rot}deg)` }}
    >
      <p className="text-[27px] leading-[1.2] font-semibold [font-family:'Bradley_Hand','Marker_Felt',cursive]">{text}</p>
    </div>
  );
}

/* The clean answer: a white app card that lands on top of the mess. */
function Card({ title, meta, children, x = 80, y, w = 920 }: { title: string; meta: string; children: ReactNode; x?: number; y: number; w?: number }) {
  return (
    <div
      className="absolute rounded-[28px] bg-white text-[#101828] overflow-hidden [filter:drop-shadow(0_50px_60px_rgba(0,0,0,0.65))]"
      style={{ left: x, top: y, width: w }}
    >
      <div className="flex items-center justify-between px-9 h-[84px] border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-[9px] bg-[#101828] text-white text-[18px] font-bold flex items-center justify-center">F</span>
          <span className="text-[25px] font-bold">{title}</span>
        </div>
        <span className="text-[20px] text-[#6A7282]">{meta}</span>
      </div>
      {children}
    </div>
  );
}

function Initials({ n }: { n: string }) {
  return <span className="w-[54px] h-[54px] shrink-0 rounded-[12px] bg-[#F0F1F3] text-[#364153] text-[20px] font-bold flex items-center justify-center">{n}</span>;
}

function Row({ left, main, sub, right, chip, tone = "plain", tight = false }: { left: ReactNode; main: string; sub: string; right?: string; chip?: string; tone?: "hold" | "ok" | "plain" | "late"; tight?: boolean }) {
  const chipCls =
    tone === "hold" ? "bg-[#FEF3C7] text-[#92400E]" : tone === "ok" ? "bg-[#E7F6E5] text-[#1D6B2B]" : tone === "late" ? "bg-[#FDE2E1] text-[#9F1C1C]" : "bg-[#F0F1F3] text-[#364153]";
  return (
    <div className={`flex items-center gap-5 px-9 ${tight ? "py-[17px]" : "py-[22px]"} border-b border-[#F0F1F3] last:border-b-0`}>
      {left}
      <div className="min-w-0 flex-1">
        <p className="text-[26px] font-semibold leading-tight">{main}</p>
        <p className="text-[20px] text-[#6A7282] leading-tight mt-1">{sub}</p>
      </div>
      {chip && <span className={`shrink-0 rounded-[8px] px-3 py-1.5 text-[18px] font-semibold ${chipCls}`}>{chip}</span>}
      {right && <span className="shrink-0 w-[150px] text-right text-[26px] font-semibold tabular-nums">{right}</span>}
    </div>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-9 h-[86px] bg-[#F7F7F8] border-t border-[#E5E7EB]">
      <span className="text-[23px] font-semibold text-[#4A5565]">{label}</span>
      <span className="font-display text-[38px] tabular-nums">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ 1. cover */
function Cover() {
  return (
    <Shell cue>
      <div className="absolute left-[80px] right-[80px] top-[110px]">
        <Head className="text-[118px]">It&apos;s Friday.</Head>
        <Sub className="mt-7 text-[38px] leading-[1.32] text-[#D4D4D8]">
          Can you answer these three questions without asking anyone?
        </Sub>
      </div>
      <Card title="Your Friday check" meta="3 questions" y={470}>
        {QUESTIONS.map((q, i) => (
          <div key={q} className="flex items-center gap-6 px-9 py-[38px] border-b border-[#F0F1F3] last:border-b-0">
            <span className="w-[54px] h-[54px] shrink-0 rounded-[12px] bg-[#101828] text-white font-display text-[26px] flex items-center justify-center">{i + 1}</span>
            <p className="flex-1 text-[31px] font-semibold leading-tight">{q}</p>
            <span className="shrink-0 w-[64px] h-[50px] rounded-[10px] border-2 border-dashed border-[#D1D5DC] text-[#99A1AF] text-[28px] font-bold flex items-center justify-center">?</span>
          </div>
        ))}
      </Card>
      <p className="absolute left-[80px] right-[80px] top-[1020px] text-[32px] leading-[1.35] text-[#A1A1AA]">
        If any answer starts with &ldquo;let me check&rdquo;, swipe.
      </p>
    </Shell>
  );
}

/* ------------------------------------------------------------- 2. invoicing */
function Invoiced() {
  return (
    <Shell>
      <Tracker at={0} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>What hasn&apos;t been invoiced yet?</Head>
        <Sub className="mt-5">Finished jobs that never became an invoice are money you&apos;ve already earned.</Sub>
      </div>
      <Bubble who="Office" text="Did anyone invoice Greenway for Tuesday?" time="16:02" x={96} y={528} rot={-3} />
      <Sticky text="Harbour — invoice??" x={760} y={500} rot={6} />
      <Card title="Done, not invoiced" meta="Example screen" y={700}>
        <Row left={<Initials n="GC" />} main="Greenway Café" sub="Fridge repair · done Tue" chip="Not invoiced" tone="hold" right="1,633.00" />
        <Row left={<Initials n="HF" />} main="Harbour Foods" sub="Cold room check · done Wed" chip="Not invoiced" tone="hold" right="960.00" />
        <Row left={<Initials n="OJ" />} main="Oakline Joinery" sub="Site visit · done Thu" chip="Not invoiced" tone="hold" right="420.00" />
        <Total label="Earned, not billed" value="3,013.00" />
      </Card>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 3. today */
function Today() {
  return (
    <Shell>
      <Tracker at={1} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>Who&apos;s doing what today?</Head>
        <Sub className="mt-5">Without ringing round or scrolling back through the group chat.</Sub>
      </div>
      <Bubble who="Office" text="Where's Lee? Hill & Co keep calling" time="10:41" x={96} y={486} rot={-2.5} w={470} />
      <Bubble who="Sam" text="Is anyone at Mara's today??" time="10:44" x={600} y={548} rot={3} w={390} />
      <Card title="Today" meta="Example screen" y={690}>
        <Row left={<Initials n="SR" />} main="Sam" sub="Greenway Café · since 09:10" chip="On site" tone="ok" tight />
        <Row left={<Initials n="LM" />} main="Lee" sub="Hill & Co · arriving 11:30" chip="On the way" tight />
        <Row left={<Initials n="AP" />} main="Ana" sub="Mara's Bakery · finished 10:45" chip="Done" tone="ok" tight />
        <Row left={<Initials n="JO" />} main="Jo" sub="Office · two quotes to send" chip="In the office" tight />
      </Card>
    </Shell>
  );
}

/* ------------------------------------------------------------------- 4. owed */
function Owed() {
  return (
    <Shell>
      <Tracker at={2} />
      <div className="absolute left-[80px] right-[80px] top-[178px]">
        <Head>Who still owes you money?</Head>
        <Sub className="mt-5">And how long they&apos;ve owed it, without digging through the books.</Sub>
      </div>
      <Bubble who="You" text="Did Kaya ever pay for March?" time="17:20" x={96} y={520} rot={-3} w={440} />
      <Sticky text="chase Hill & Co!!" x={740} y={490} rot={-5} />
      <Card title="Waiting to be paid" meta="Example screen" y={700}>
        <Row left={<Initials n="KB" />} main="Kaya Building" sub="Invoice sent 51 days ago" chip="Overdue" tone="late" right="7,300.00" />
        <Row left={<Initials n="HC" />} main="Hill & Co" sub="Invoice sent 34 days ago" chip="Overdue" tone="late" right="4,120.00" />
        <Row left={<Initials n="MB" />} main="Mara's Bakery" sub="Invoice sent 12 days ago" chip="Due soon" right="1,180.00" />
        <Total label="Owed to you" value="12,600.00" />
      </Card>
    </Shell>
  );
}

/* --------------------------------------------------------------- 5. the offer */
function Offer() {
  const tiles = [
    { k: "Not invoiced yet", v: "3,013.00", s: "3 finished jobs" },
    { k: "Out on jobs today", v: "4 people", s: "Everyone accounted for" },
    { k: "Owed to you", v: "12,600.00", s: "2 overdue" },
  ];
  return (
    <Shell>
      <div className="absolute left-[80px] right-[80px] top-[110px]">
        <Head className="text-[96px]">One screen answers all three.</Head>
        <Sub className="mt-6">
          We build it around how your business already works, so the answers fill themselves in as the
          work gets done. If a spreadsheet would do the job, we&apos;ll tell you.
        </Sub>
      </div>
      <Card title="Friday" meta="Example screen" y={640}>
        <div className="grid grid-cols-3">
          {tiles.map((t, i) => (
            <div key={t.k} className={`px-8 py-9 ${i < 2 ? "border-r border-[#E5E7EB]" : ""}`}>
              <p className="text-[21px] font-semibold text-[#6A7282]">{t.k}</p>
              <p className="font-display text-[40px] tabular-nums mt-3 leading-none">{t.v}</p>
              <p className="text-[19px] text-[#6A7282] mt-3">{t.s}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="absolute left-[80px] top-[1000px] flex items-center gap-6">
        <span className="inline-flex items-center gap-3 rounded-[14px] bg-[#99E58C] text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[28px] px-9 h-[84px]">
          Book a free call →
        </span>
        <span className="text-[26px] text-[#A1A1AA]">flowrate.agency · link in bio</span>
      </div>
    </Shell>
  );
}

const SLIDES = [
  { slug: "slide-01-its-friday", node: <Cover /> },
  { slug: "slide-02-not-invoiced", node: <Invoiced /> },
  { slug: "slide-03-who-is-doing-what", node: <Today /> },
  { slug: "slide-04-who-owes-you", node: <Owed /> },
  { slug: "slide-05-one-screen", node: <Offer /> },
];

export function Carousel21({ s }: { s?: string }) {
  const i = Number(s);
  if (i >= 1 && i <= SLIDES.length) return <>{SLIDES[i - 1].node}</>;
  return (
    <div className="flex flex-wrap gap-10 p-10">
      {SLIDES.map((sl) => <div key={sl.slug}>{sl.node}</div>)}
    </div>
  );
}
