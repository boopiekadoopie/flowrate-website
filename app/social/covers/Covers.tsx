"use client";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Chat, Mail, Receipt, Sheet, Sticky } from "@/components/Paperwork";

/*
 * Profile covers, hero-style: the everyday mess a business runs on drifts on the left, a plain
 * statement of what Flowrate builds sits in the middle, and the clean things we build sit on the
 * right, each labelled (website, app, dashboard). Not one problem: the whole range.
 * ?c=li | lip | fb  ·  &theme=dark  ·  &guides=1 shows the avatar / crop safe zones.
 */

const HEAD = "Custom apps, systems and websites for your business.";
const SUB = "Built around how you already work, so the paperwork, chasing and retyping stop.";
const SERVICES = ["Custom apps", "Business systems", "Websites", "Dashboards & reports"];

type Theme = { dark: boolean };

/* ------------------------------------------------------------------ the mess (problems) */
/* Receipt, Chat, Sheet, Sticky and Mail live in components/Paperwork.tsx, shared with the hero. */

/* ------------------------------------------------------------------ what we build (solutions) */
function Tag({ children, dark }: { children: ReactNode; dark: boolean }) {
  return (
    <span className={`absolute -top-3 left-4 z-10 rounded-[6px] px-2.5 py-1 text-[12px] font-bold tracking-[0.02em] ${dark ? "bg-white text-[#101828]" : "bg-[#101828] text-white"}`}>
      {children}
    </span>
  );
}

const deviceShadow = "[filter:drop-shadow(0_28px_36px_rgba(16,24,40,0.32))_drop-shadow(0_8px_12px_rgba(16,24,40,0.16))]";

/* A website, in a plain browser frame (no window-control dots). */
function Browser({ dark }: Theme) {
  return (
    <div className={`relative ${deviceShadow}`}>
      <Tag dark={dark}>Website</Tag>
      <div className="w-[380px] rounded-[12px] overflow-hidden bg-white border border-[#E5E7EB]">
        <div className="h-[30px] bg-[#F5F5F5] border-b border-[#E5E7EB] flex items-center justify-center">
          <span className="w-[200px] h-[18px] rounded-[5px] bg-white border border-[#E5E7EB] text-[10px] text-[#99A1AF] flex items-center justify-center">greenwaycafe.co.za</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-[10px] text-[#4A5565]">
          <span className="font-extrabold text-[12px] text-[#101828]">Greenway</span>
          <span className="flex gap-3"><span>Menu</span><span>Events</span><span>Contact</span></span>
        </div>
        <div className="grid grid-cols-[1.1fr_1fr] gap-3 px-4 pb-4">
          <div className="pt-2">
            <p className="text-[19px] font-extrabold leading-[1.05] text-[#101828]">Fresh food, booked in seconds.</p>
            <p className="text-[10px] text-[#6A7282] mt-1.5 leading-snug">Pick a time, we&apos;ll keep your table ready.</p>
            <span className="inline-block mt-3 rounded-[6px] bg-[#99E58C] px-3 py-1.5 text-[10px] font-bold text-[#0C1A0D]">Book a table</span>
          </div>
          <div className="relative h-[118px] rounded-[8px] overflow-hidden">
            <Image src="/social/photos/03-hospitality-backoffice.jpeg" alt="" fill sizes="200px" className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* An app, on a phone mockup (device only, no hand or photo background). */
function PhoneApp({ dark }: Theme) {
  const field = (label: string, value: string) => (
    <div className="rounded-[8px] bg-[#F3F4F6] px-2.5 py-1.5">
      <p className="text-[8.5px] text-[#6A7282]">{label}</p>
      <p className="text-[11.5px] font-semibold text-[#101828] leading-tight">{value}</p>
    </div>
  );
  return (
    <div className={`relative ${deviceShadow}`}>
      <Tag dark={dark}>App</Tag>
      <div className="w-[196px] h-[400px] rounded-[36px] bg-[#0E0E0E] p-[8px] shadow-[inset_0_0_0_1.5px_#2A2A2A]">
        <div className="relative w-full h-full rounded-[29px] bg-white overflow-hidden flex flex-col px-3 pt-10 pb-3 gap-1.5">
          <span className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[64px] h-[18px] rounded-full bg-black" />
          <p className="text-[16px] font-extrabold text-[#101828] leading-none">New job</p>
          <p className="text-[9px] text-[#6A7282] mb-1">Fill it in once</p>
          {field("Customer", "Greenway Café")}
          {field("What was done", "Fridge repair")}
          {field("Done by", "Sam")}
          <div className="rounded-[8px] bg-[#F3F4F6] p-1.5 flex items-center gap-1.5">
            <div className="relative w-[30px] h-[30px] rounded-[5px] overflow-hidden"><Image src="/social/photos/06-warehouse-note.jpeg" alt="" fill sizes="30px" className="object-cover" /></div>
            <p className="text-[9.5px] font-semibold text-[#101828] leading-tight">Photo of the signed note</p>
          </div>
          <div className="mt-auto rounded-[10px] bg-[#99E58C] text-[#0C1A0D] text-center font-extrabold text-[12px] py-2">Send</div>
        </div>
      </div>
    </div>
  );
}

/* A business system / dashboard: the numbers and the jobs in one place. */
function Dashboard({ dark }: Theme) {
  const bars = [38, 52, 44, 66, 58, 74, 88];
  const rows = [["Greenway Café", "Invoiced", "bg-[#1F1F1F] text-white"], ["Hill & Co", "In progress", "bg-[#FEF3C7] text-[#92400E]"], ["Mara's Salon", "Done", "bg-[#EAF8E6] text-[#1D6B2B]"]];
  return (
    <div className={`relative ${deviceShadow}`}>
      <Tag dark={dark}>Dashboard</Tag>
      <div className="w-[270px] rounded-[12px] bg-white border border-[#E5E7EB] p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-[#6A7282]">Jobs this month</p>
            <p className="text-[24px] font-extrabold text-[#101828] leading-none mt-1">142</p>
          </div>
          <div className="flex items-end gap-[4px] h-[44px]">
            {bars.map((b, i) => <span key={i} className={`w-[9px] rounded-[2px] ${i === bars.length - 1 ? "bg-[#1D6B2B]" : "bg-[#101828]/80"}`} style={{ height: `${b}%` }} />)}
          </div>
        </div>
        <div className="mt-3 border-t border-[#F0F0F0]">
          {rows.map(([n, s, c]) => (
            <p key={n} className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0] last:border-0 text-[11px] text-[#101828]">
              <span>{n}</span><span className={`px-1.5 py-0.5 rounded-[4px] text-[9.5px] font-semibold ${c}`}>{s}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ layout helpers */
function At({ x, y, r = 0, k = 1, children }: { x: number; y: number; r?: number; k?: number; children: ReactNode }) {
    /* zoom also scales left/top, so positions are divided back out */
  const style: CSSProperties = { left: x / k, top: y / k, transform: `rotate(${r}deg)`, zoom: k };
  return <div className="absolute" style={style}>{children}</div>;
}

function Frame({ w, h, dark, children, guides }: { w: number; h: number; dark: boolean; children: ReactNode; guides?: ReactNode }) {
  return (
    <div data-cover className={`relative overflow-hidden ${dark ? "bg-[#0B0B0C] text-[#F4F4F5]" : "bg-white text-[#101828]"}`} style={{ width: w, height: h }}>
      {dark ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_45%,rgba(153,229,140,0.09),transparent)]" />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(153,229,140,0.20)_0%,rgba(191,219,254,0.24)_50%,rgba(254,240,199,0.22)_100%)] [mask-image:radial-gradient(70%_90%_at_50%_50%,black,transparent)]" />
      )}
      {children}
      {guides}
    </div>
  );
}

function Center({ dark, w, head, sub, chips, gap = "mt-4", chipSize = "text-[15px] px-3.5 py-2", className = "" }: { dark: boolean; w: number; head: string; sub: string; chips: boolean; gap?: string; chipSize?: string; className?: string }) {
  return (
    <div className={`absolute text-center ${className}`} style={{ width: w }}>
      <h1 className="font-display uppercase leading-[0.98] tracking-[-0.025em] [text-wrap:balance]">{head}</h1>
      {sub && <p className={`${gap} [text-wrap:balance] ${dark ? "text-[#A1A1AA]" : "text-[#4A5565]"}`}>{sub}</p>}
      {chips && (
        <div className={`${gap} flex flex-wrap justify-center gap-2`}>
          {SERVICES.map((s) => (
            <span key={s} className={`rounded-[8px] font-semibold ${chipSize} ${dark ? "bg-white/[0.07] text-white ring-1 ring-white/12" : "bg-white text-[#101828] ring-1 ring-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"}`}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const Guide = ({ style, label }: { style: CSSProperties; label: string }) => (
  <div className="absolute border-2 border-dashed border-[#E11D48] bg-[#E11D48]/15 text-[#E11D48] text-[12px] font-bold p-1 z-50" style={style}>{label}</div>
);

/* ---------------------------------------------------------------- Facebook 1640×624 */
function Facebook({ dark, guides }: Theme & { guides: boolean }) {
  return (
    <Frame
      w={1640}
      h={624}
      dark={dark}
      guides={
        guides && (
          <>
            <div className="absolute inset-y-0 left-0 w-[265px] bg-[#E11D48]/15 border-r-2 border-dashed border-[#E11D48] z-50" />
            <div className="absolute inset-y-0 right-0 w-[265px] bg-[#E11D48]/15 border-l-2 border-dashed border-[#E11D48] z-50" />
            <Guide label="profile photo" style={{ left: 60, top: 540, width: 360, height: 84 }} />
          </>
        )
      }
    >
      {/* the mess */}
      <At x={70} y={60} r={-9}><Receipt /></At>
      <At x={250} y={40} r={4}><Chat /></At>
      <At x={290} y={210} r={-4}><Sheet /></At>
      <At x={60} y={300} r={7}><Sticky /></At>
      <At x={240} y={380} r={3}><Mail /></At>
      {/* what we build: phone in front so it stays inside the mobile crop */}
      <At x={1250} y={56}><Browser dark={dark} /></At>
      <At x={1290} y={336}><Dashboard dark={dark} /></At>
      <At x={1110} y={150}><PhoneApp dark={dark} /></At>
      <Center
        dark={dark}
        w={560}
        head={HEAD}
        sub={SUB}
        chips
        className="left-[540px] top-[128px] [&_h1]:text-[46px] [&_p]:text-[19px]"
        chipSize="text-[15px] px-3.5 py-2"
      />
      <p className={`absolute left-[540px] w-[560px] top-[548px] text-center text-[18px] font-semibold ${dark ? "text-white" : "text-[#101828]"}`}>flowrate.agency</p>
    </Frame>
  );
}

/* ---------------------------------------------------------------- LinkedIn profile 1584×396 */
function LinkedInProfile({ dark, guides }: Theme & { guides: boolean }) {
  return (
    <Frame w={1584} h={396} dark={dark} guides={guides && <Guide label="profile photo" style={{ left: 40, top: 236, width: 330, height: 160 }} />}>
      <At x={40} y={24} r={-6} k={0.8}><Chat /></At>
      <At x={250} y={86} r={5} k={0.8}><Sticky /></At>
      <At x={50} y={120} r={-3} k={0.75}><Sheet /></At>
      <At x={398} y={196} r={-8} k={0.7}><Receipt /></At>
      <At x={1120} y={30} k={0.72}><Browser dark={dark} /></At>
      <At x={1150} y={232} k={0.62}><Dashboard dark={dark} /></At>
      <At x={1395} y={56} k={0.78}><PhoneApp dark={dark} /></At>
      <Center
        dark={dark}
        w={600}
        head={HEAD}
        sub=""
        chips
        gap="mt-4"
        className="left-[500px] top-[82px] [&_h1]:text-[38px]"
        chipSize="text-[14px] px-3 py-1.5"
      />
      <p className={`absolute left-[500px] w-[600px] top-[316px] text-center text-[17px] font-semibold ${dark ? "text-white" : "text-[#101828]"}`}>flowrate.agency</p>
    </Frame>
  );
}

/* ---------------------------------------------------------------- LinkedIn page 1128×191 */
function LinkedInPage({ dark, guides }: Theme & { guides: boolean }) {
  return (
    <Frame w={1128} h={191} dark={dark} guides={guides && <Guide label="logo" style={{ left: 16, top: 96, width: 150, height: 95 }} />}>
      <At x={20} y={10} r={-6} k={0.55}><Sticky /></At>
      <At x={88} y={20} r={4} k={0.5}><Chat /></At>
      <Center
        dark={dark}
        w={520}
        head={HEAD}
        sub=""
        chips
        gap="mt-2.5"
        className="left-[250px] top-[34px] [&_h1]:text-[24px]"
        chipSize="text-[11px] px-2.5 py-1"
      />
      <At x={800} y={22} k={0.46}><Browser dark={dark} /></At>
      <At x={990} y={38} k={0.42}><PhoneApp dark={dark} /></At>
    </Frame>
  );
}

export function Covers({ c, guides, theme }: { c?: string; guides: boolean; theme?: string }) {
  const dark = theme === "dark";
  if (c === "li") return <LinkedInProfile dark={dark} guides={guides} />;
  if (c === "lip") return <LinkedInPage dark={dark} guides={guides} />;
  if (c === "fb") return <Facebook dark={dark} guides={guides} />;
  return (
    <div className="flex flex-col gap-10 p-10">
      <LinkedInProfile dark={dark} guides={guides} />
      <LinkedInPage dark={dark} guides={guides} />
      <Facebook dark={dark} guides={guides} />
    </div>
  );
}
