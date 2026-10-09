"use client";
import Image from "next/image";
import type { ReactNode } from "react";

/*
 * Carousel 20 (dark): "Write it down. Type it in. Type it in again."
 * Plain words for people who have never heard of a "system": the same information gets typed three
 * times, a few minutes each time adds up, we build one simple app so it is entered once.
 * Same brand DNA as the site (Archivo, Jakarta, carbon, green only on the action), new treatment:
 * photographs as physical prints, big type, a real app screen placed inside a photographed phone.
 */

const W = 1080;
const H = 1350;
const P = "/social/photos";

function Shell({ children, cue = false }: { children: ReactNode; cue?: boolean }) {
  return (
    <div data-slide className="relative overflow-hidden bg-[#0B0B0C] text-[#F4F4F5]" style={{ width: W, height: H }}>
      {/* one soft pool of light, top right, so the black is not flat */}
      <div aria-hidden className="pointer-events-none absolute -top-[30%] -right-[20%] w-[900px] h-[900px] bg-[radial-gradient(closest-side,rgba(153,229,140,0.10),transparent)]" />
      {children}
      <footer className="absolute left-[80px] bottom-[56px] flex items-center gap-4">
        <Image src="/mascot.png" alt="" width={1002} height={1530} priority className="h-[72px] w-auto" />
        <span className="font-extrabold text-[30px] tracking-tight leading-none">Flowrate</span>
      </footer>
      {cue && <span className="absolute right-[80px] bottom-[74px] text-[26px] font-semibold text-[#A1A1AA]">Swipe →</span>}
    </div>
  );
}

function Head({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h1 className={`font-display uppercase text-[80px] leading-[0.96] tracking-[-0.025em] [text-wrap:balance] ${className}`}>{children}</h1>;
}
function Sub({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[31px] leading-[1.42] text-[#A1A1AA] [text-wrap:pretty] ${className}`}>{children}</p>;
}

/* A photograph treated as a physical print lying on the dark page. */
export function Print({ src, w, h, rot, className = "", pos = "center" }: { src: string; w: number; h: number; rot: number; className?: string; pos?: string }) {
  return (
    <div
      className={`absolute rounded-[10px] overflow-hidden ring-1 ring-white/10 [filter:drop-shadow(0_40px_50px_rgba(0,0,0,0.6))] ${className}`}
      style={{ width: w, height: h, transform: `rotate(${rot}deg)` }}
    >
      <Image src={src} alt="" fill sizes="900px" className="object-cover" style={{ objectPosition: pos }} />
    </div>
  );
}

/* ------------------------------------------------------------------ 1. cover */
function Cover() {
  return (
    <Shell cue>
      <div className="absolute left-[80px] right-[80px] top-[96px]">
        <Head className="text-[92px]">
          Write it down.
          <br />
          <span className="text-[#F4F4F5]/70">Type it in.</span>
          <br />
          <span className="text-[#F4F4F5]/40">Type it in again.</span>
        </Head>
        <Sub className="mt-8 max-w-[820px]">If your business still runs on paper, WhatsApp and spreadsheets, this is for you.</Sub>
      </div>
      <Print src={`${P}/10-chaos-flatlay.jpeg`} w={720} h={540} rot={-4} className="left-[180px] top-[600px]" pos="50% 45%" />
    </Shell>
  );
}

/* ------------------------------------------------------------------ 2. three times */
function MiniSheet() {
  const rows = [["Greenway", "Fridge repair", "✓"], ["Hill & Co", "Deliver 12 boxes", "✓"], ["Mara's Salon", "Callout", ""]];
  return (
    <div className="w-[300px] rounded-[8px] bg-white text-[#101828] text-[15px] overflow-hidden">
      <div className="grid grid-cols-[1.2fr_1.2fr_44px] bg-[#F3F4F6] text-[#6A7282] font-semibold">
        {["Customer", "Job", "Paid"].map((c) => <span key={c} className="px-2.5 py-1.5 border-r border-[#E5E7EB] last:border-0">{c}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="grid grid-cols-[1.2fr_1.2fr_44px] border-t border-[#EEF0F2]">
          {r.map((c, i) => <span key={i} className="px-2.5 py-1.5 truncate border-r border-[#EEF0F2] last:border-0">{c}</span>)}
        </div>
      ))}
    </div>
  );
}
function MiniInvoice() {
  return (
    <div className="w-[300px] rounded-[8px] bg-white text-[#101828] p-3.5 text-[15px]">
      <p className="flex justify-between font-bold text-[17px]"><span>Invoice</span><span className="text-[#6A7282] font-medium">Greenway Café</span></p>
      <p className="mt-2 flex justify-between text-[#4A5565]"><span>Fridge repair</span><span>850.00</span></p>
      <p className="flex justify-between text-[#4A5565]"><span>Callout</span><span>350.00</span></p>
      <p className="mt-2 pt-2 border-t border-[#E5E7EB] flex justify-between font-bold"><span>Total</span><span>1 200.00</span></p>
    </div>
  );
}
function Times() {
  const steps: { n: string; title: string; note: string; art: ReactNode }[] = [
    { n: "1", title: "Written on paper", note: "By whoever did the job", art: <div className="relative w-[300px] h-[150px] rounded-[8px] overflow-hidden"><Image src={`${P}/06-warehouse-note.jpeg`} alt="" fill sizes="300px" className="object-cover" style={{ objectPosition: "60% 60%" }} /></div> },
    { n: "2", title: "Typed into a spreadsheet", note: "Usually at the end of the day", art: <MiniSheet /> },
    { n: "3", title: "Typed again for the invoice", note: "Often days later", art: <MiniInvoice /> },
  ];
  return (
    <Shell>
      <div className="absolute left-[80px] right-[80px] top-[96px]">
        <Head>The same job, typed three times.</Head>
        <Sub className="mt-6">Every business has a version of this.</Sub>
      </div>
      <div className="absolute left-[80px] right-[80px] top-[470px] flex flex-col gap-5">
        {steps.map((s) => (
          <div key={s.n} className="flex items-center gap-7 rounded-[18px] bg-white/[0.04] ring-1 ring-white/10 p-6">
            <span className="font-display text-[88px] leading-none text-white/25 w-[70px] text-center">{s.n}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[34px] font-bold leading-tight">{s.title}</p>
              <p className="text-[25px] text-[#A1A1AA] mt-1">{s.note}</p>
            </div>
            <div className="flex-shrink-0">{s.art}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 3. it adds up */
function Cell({ big, small }: { big: string; small: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-[120px] leading-none tracking-[-0.03em]">{big}</p>
      <p className="mt-3 text-[26px] text-[#A1A1AA]">{small}</p>
    </div>
  );
}
function AddsUp() {
  return (
    <Shell>
      <div className="absolute left-[80px] right-[80px] top-[96px]">
        <Head>A few minutes each time. It adds up.</Head>
      </div>
      <div className="absolute left-[80px] right-[80px] top-[440px] rounded-[24px] bg-white/[0.04] ring-1 ring-white/10 px-10 pt-14 pb-10">
        <div className="flex items-start justify-between">
          <Cell big="5" small="minutes a job" />
          <span className="font-display text-[80px] text-white/30 mt-4">×</span>
          <Cell big="20" small="jobs a day" />
        </div>
        <div className="my-9 h-px bg-white/10" />
        <p className="text-center font-display text-[132px] leading-none tracking-[-0.03em] text-white">1h 40m</p>
        <p className="mt-4 text-center text-[30px] text-[#D4D4D8]">of typing, every working day</p>
        <p className="mt-8 text-center text-[22px] text-[#71717A]">An example. Try it with your own numbers.</p>
      </div>
      <div className="absolute left-[80px] right-[80px] top-[1080px] flex items-center gap-5 rounded-[16px] bg-[#FEF3C7] text-[#78350F] px-7 py-5">
        <span className="font-display text-[34px] whitespace-nowrap">
          <span className="line-through decoration-[3px]">4 860</span> → 4 680
        </span>
        <span className="text-[25px] leading-snug font-semibold">And every time it&apos;s typed, it can be typed wrong.</span>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 4. what we build */
/* Phone photo crop: source 928×1152, phone screen at x342–585, y298–828. */
const CROP = { x: 250, y: 230, w: 430, h: 680 };
const K = 0.98;
const SCR = { x: (342 - CROP.x) * K, y: (298 - CROP.y) * K, w: (585 - 342) * K, h: (828 - 298) * K };

function AppScreen() {
  const field = (label: string, value: string) => (
    <div className="rounded-[10px] bg-[#F3F4F6] px-3 py-2">
      <p className="text-[11px] text-[#6A7282]">{label}</p>
      <p className="text-[15px] font-semibold text-[#101828] leading-tight">{value}</p>
    </div>
  );
  return (
    <div className="absolute overflow-hidden bg-white rounded-[30px] flex flex-col px-3.5 pt-11 pb-4 gap-2" style={{ left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h }}>
      <p className="text-[21px] font-extrabold text-[#101828] leading-none">New job</p>
      <p className="text-[12px] text-[#6A7282] -mt-0.5 mb-1">Fill it in once</p>
      {field("Customer", "Greenway Café")}
      {field("What was done", "Fridge repair")}
      {field("Done by", "Sam")}
      <div className="rounded-[10px] bg-[#F3F4F6] p-2 flex items-center gap-2">
        <div className="relative w-[46px] h-[46px] rounded-[6px] overflow-hidden"><Image src={`${P}/06-warehouse-note.jpeg`} alt="" fill sizes="46px" className="object-cover" style={{ objectPosition: "60% 60%" }} /></div>
        <p className="text-[13px] text-[#101828] font-semibold leading-tight">Photo of the<br />signed note</p>
      </div>
      <div className="mt-auto rounded-[12px] bg-[#99E58C] text-[#0C1A0D] text-center font-extrabold text-[17px] py-3">Send</div>
    </div>
  );
}

/* The photographed hand and phone with our app screen placed inside it (native size PHONE_W × PHONE_H). */
export const PHONE_W = CROP.w * K;
export const PHONE_H = CROP.h * K;
export function PhonePhoto() {
  return (
    <div className="relative rounded-[16px] overflow-hidden ring-1 ring-white/10" style={{ width: PHONE_W, height: PHONE_H }}>
      <div className="absolute" style={{ left: -CROP.x * K, top: -CROP.y * K, width: 928 * K, height: 1152 * K }}>
        <Image src={`${P}/08-phone-in-hand.jpeg`} alt="" fill sizes="1000px" className="object-cover" />
      </div>
      <AppScreen />
      {/* the phone's camera cut-out sits on top of our screen, as on a real phone */}
      <span className="absolute bg-black rounded-full" style={{ left: SCR.x + SCR.w / 2 - 34, top: SCR.y + 9, width: 68, height: 20 }} />
    </div>
  );
}

function Build() {
  const out = ["Your office sees it straight away", "Your records update by themselves", "The invoice is ready for you to check"];
  return (
    <Shell>
      <div className="absolute left-[80px] right-[80px] top-[96px]">
        <Head>We build one simple app for your business.</Head>
        <Sub className="mt-6 max-w-[860px]">Your team fills it in once, on their phone. Everything else fills itself in.</Sub>
      </div>
      <div className="absolute left-[80px] top-[500px]">
        <PhonePhoto />
      </div>
      <div className="absolute left-[570px] right-[80px] top-[520px] flex flex-col gap-5">
        {out.map((t, i) => (
          <div key={t} className="rounded-[16px] bg-white/[0.05] ring-1 ring-white/10 px-6 py-6">
            <p className="font-display text-[30px] text-white/30 leading-none">0{i + 1}</p>
            <p className="mt-3 text-[29px] font-bold leading-[1.2]">{t}</p>
          </div>
        ))}
        <p className="text-[24px] text-[#A1A1AA] mt-1 leading-snug">No typing it in again. No chasing.</p>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 5. close */
function Close() {
  return (
    <Shell>
      <div className="absolute left-[80px] right-[80px] top-[96px]">
        <Head>Less typing. Fewer mistakes. Your evenings back.</Head>
        <Sub className="mt-6 max-w-[880px]">We build it around how you already work, for any business. And if a spreadsheet is enough, we&apos;ll tell you.</Sub>
      </div>
      <Print src={`${P}/11-clear-desk.jpeg`} w={520} h={520} rot={3} className="right-[90px] top-[640px]" />
      <div className="absolute left-[80px] top-[720px] w-[400px]">
        <span className="inline-flex items-center gap-3 bg-[#99E58C] text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[24px] px-8 py-5 rounded-[12px]">
          Book a free call
          <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6" aria-hidden><path d="M3 10h13m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <p className="mt-5 text-[26px] font-semibold">flowrate.agency</p>
        <p className="mt-2 text-[22px] text-[#A1A1AA]">or send us a message</p>
      </div>
    </Shell>
  );
}

const SLIDES: { slug: string; node: ReactNode }[] = [
  { slug: "cover", node: <Cover /> },
  { slug: "three-times", node: <Times /> },
  { slug: "it-adds-up", node: <AddsUp /> },
  { slug: "we-build-it", node: <Build /> },
  { slug: "your-evenings-back", node: <Close /> },
];

export function Carousel20({ s }: { s?: string }) {
  const i = Number(s);
  if (i >= 1 && i <= SLIDES.length) return <>{SLIDES[i - 1].node}</>;
  return (
    <div className="flex flex-wrap gap-10 p-10">
      {SLIDES.map((sl) => <div key={sl.slug}>{sl.node}</div>)}
    </div>
  );
}
