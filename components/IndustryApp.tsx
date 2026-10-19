import type { ReactNode } from "react";
import { PhoneFrame } from "./playground/kit";

/*
 * One example app per industry, each in its own (made-up) brand, so the pages don't all look like the same app:
 * Kestrel Plumbing (blue), Northbound Freight (orange on dark), Willowmere Farm (forest and wheat),
 * Atelier Lune (blush and plum, serif diary), Ironbark Timber (safety yellow on black, tablet).
 * Same five brands as the "Made to fit" reel and carousel. Names and numbers are examples.
 */

const Tick = ({ c = "currentColor", s = 14 }: { c?: string; s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden><path d="M3.5 8.5l3 3 6-7" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Icon = ({ d, c = "currentColor", s = 16, w = 1.8 }: { d: string; c?: string; s?: number; w?: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);
const CAM = "M4 8h3l2-2.5h6L17 8h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z";
const PIN = "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z";
const SIG = "M6 40 C 18 8, 30 10, 27 34 S 44 48, 50 24 S 62 6, 64 32 C 67 46, 78 42, 84 28 C 90 16, 96 24, 98 32 C 102 44, 116 36, 124 26 C 132 16, 140 30, 146 30 C 158 32, 168 22, 196 20";

/* ------------------------------------------------------------------ trades: Kestrel Plumbing */
function Trades() {
  const B = "#1E4FD8";
  return (
    <PhoneFrame h={620}>
      <div className="px-3 pb-3 font-['Avenir_Next','Avenir',system-ui,sans-serif]">
        <div className="rounded-[22px] px-4 pt-4 pb-5 text-white" style={{ background: B }}>
          <p className="text-[12px] font-semibold opacity-75">Kestrel Plumbing · Today</p>
          <p className="text-[22px] font-bold leading-tight mt-0.5">Job 0418</p>
          <p className="text-[13px] opacity-85 mt-1">Blocked drain · 14 Oak St · 09:30</p>
          <span className="mt-3 inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-full bg-white text-[12px] font-bold" style={{ color: B }}>
            <Icon d={PIN} c={B} s={13} w={2} />On site
          </span>
        </div>
        <p className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6A7282]">Photos</p>
        <div className="grid grid-cols-3 gap-2">
          {["Before", "After"].map((t) => (
            <div key={t} className="h-[64px] rounded-[14px] flex flex-col items-center justify-center gap-1 text-[11px] font-semibold" style={{ background: "#E8EEFC", color: B }}>
              <Icon d={CAM} c={B} s={18} />{t}
            </div>
          ))}
          <div className="h-[64px] rounded-[14px] border-2 border-dashed border-[#C9D5F5] flex items-center justify-center text-[20px] font-light" style={{ color: B }}>+</div>
        </div>
        <div className="mt-4 rounded-[16px] bg-white border border-[#E5E7EB] p-3 space-y-2">
          {["Drain cleared", "Pipe checked", "Area cleaned"].map((s) => (
            <p key={s} className="flex items-center gap-2.5 text-[13px] font-semibold">
              <span className="w-[22px] h-[22px] rounded-[7px] flex items-center justify-center text-white" style={{ background: B }}><Tick s={13} /></span>{s}
            </p>
          ))}
        </div>
        <div className="mt-3 rounded-[16px] bg-white border border-[#E5E7EB] px-3 py-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6A7282]">Signed by customer</p>
          <svg viewBox="0 0 200 50" className="w-full h-[38px]"><path d={SIG} fill="none" stroke={B} strokeWidth="2.6" strokeLinecap="round" /></svg>
        </div>
        <div className="mt-3 h-[50px] rounded-[16px] text-white text-[14px] font-bold flex items-center justify-center" style={{ background: B }}>Finish job</div>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ transport: Northbound Freight */
function Transport() {
  const O = "#FF6A1F";
  return (
    <PhoneFrame h={620}>
      <div className="absolute inset-0 z-[21] bg-[#121214]">
        <div className="h-[46px] flex items-center justify-between px-7 text-[13px] font-semibold text-white"><span className="tabular-nums">6:42</span><span className="flex items-end gap-[2px]">{[4, 6, 8, 10].map((x) => <span key={x} className="w-[3px] rounded-[1px] bg-white" style={{ height: x }} />)}</span></div>
      </div>
      <div className="relative z-[22] px-3 pb-3 text-white font-['Rockwell','Roboto_Slab',Georgia,serif]">
        <p className="text-[12px] text-white/60 font-bold tracking-[0.08em] uppercase">Northbound Freight</p>
        <div className="mt-2 rounded-[20px] overflow-hidden bg-[#1E1F23] h-[210px] relative">
          <svg viewBox="0 0 280 210" className="absolute inset-0 w-full h-full" aria-hidden>
            <g stroke="#2E3036" strokeWidth="10" fill="none" strokeLinecap="round"><path d="M-10 60 C 80 50, 140 90, 300 70" /><path d="M60 -10 C 70 80, 40 150, 80 230" /><path d="M-10 160 C 90 150, 180 180, 300 150" /><path d="M200 -10 C 190 70, 230 140, 210 230" /></g>
            <path d="M40 180 C 70 150, 60 110, 110 95 S 190 80, 225 40" fill="none" stroke={O} strokeWidth="5" strokeLinecap="round" />
            <circle cx="40" cy="180" r="6" fill="#fff" /><circle cx="225" cy="40" r="7" fill={O} />
          </svg>
          <span className="absolute left-3 bottom-3 h-[26px] px-2.5 rounded-full text-[12px] font-bold flex items-center text-[#121214]" style={{ background: O }}>32 min to drop</span>
        </div>
        <div className="mt-3 rounded-[18px] bg-[#1E1F23] p-3.5">
          <p className="text-[19px] font-bold">Load 2416</p>
          <p className="text-[12px] text-white/60 mt-0.5 font-sans">Tipper · Truck 7 · Ben</p>
          <p className="mt-3 mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white/50 font-sans">Documents</p>
          <div className="grid grid-cols-3 gap-2 font-sans">
            {["Delivery note", "Weighbridge"].map((t) => (
              <div key={t} className="h-[62px] rounded-[12px] bg-[#2A2B30] flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-white/80">
                <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[#121214]" style={{ background: O }}><Tick s={12} /></span>{t}
              </div>
            ))}
            <div className="h-[62px] rounded-[12px] border-2 border-dashed border-white/20 flex items-center justify-center text-white/60 text-[20px]">+</div>
          </div>
        </div>
        <div className="mt-3 h-[50px] rounded-[16px] text-[#121214] text-[14px] font-bold flex items-center justify-center font-sans" style={{ background: O }}>Submit load</div>
        <p className="mt-2 text-center text-[11px] text-white/50 font-sans">No signal? It sends itself later.</p>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ farms: Willowmere Farm */
function Farms() {
  const G = "#2F5D3A", W = "#EDB93F", C = "#F7F2E3";
  return (
    <PhoneFrame h={620}>
      <div className="absolute inset-0" style={{ background: C }} />
      <div className="relative px-3 pb-3 font-['Gill_Sans','Gill_Sans_MT','Trebuchet_MS',sans-serif]" style={{ color: G }}>
        <div className="rounded-[22px] px-4 pt-4 pb-4" style={{ background: G, color: C }}>
          <p className="text-[13px] opacity-80">Willowmere Farm</p>
          <p className="text-[24px] font-semibold leading-tight">Tuesday</p>
          <p className="text-[13px] mt-1" style={{ color: W }}>3 jobs left today</p>
        </div>
        <div className="mt-3 space-y-2">
          {[["Move cattle to paddock 4", true], ["Fix the trough at the dam", false], ["Check fence, north line", false]].map(([t, done]) => (
            <div key={t as string} className="h-[52px] rounded-[16px] bg-white/80 px-3 flex items-center gap-3 text-[14px] font-semibold" style={{ opacity: done ? 0.6 : 1 }}>
              <span className="w-[24px] h-[24px] rounded-full flex items-center justify-center" style={done ? { background: G, color: C } : { boxShadow: `inset 0 0 0 2px ${G}` }}>{done && <Tick s={13} />}</span>
              <span className={done ? "line-through" : ""}>{t as string}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-[0.1em] opacity-70">Today&apos;s readings</p>
        <div className="grid grid-cols-3 gap-2">
          {[["Rain", "12 mm"], ["Dam", "78%"], ["Cattle", "214"]].map(([k, v]) => (
            <div key={k} className="rounded-[16px] px-2.5 py-3" style={{ background: W }}>
              <p className="text-[11px] font-semibold opacity-75">{k}</p>
              <p className="text-[18px] font-bold leading-tight whitespace-nowrap">{v}</p>
            </div>
          ))}
        </div>
        <span className="mt-4 inline-flex items-center gap-2 h-[30px] px-3 rounded-full text-[12px] font-semibold" style={{ background: "rgba(47,93,58,0.1)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: W }} />No signal · saved on the phone
        </span>
        <div className="mt-3 h-[50px] rounded-[16px] text-[15px] font-semibold flex items-center justify-center" style={{ background: G, color: C }}>Add a reading</div>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ salons: Atelier Lune */
function Salons() {
  const P = "#4A2040", K = "#EFB8C2";
  const SERIF = "font-['Didot','Bodoni_72','Playfair_Display',Georgia,serif]";
  return (
    <PhoneFrame h={620}>
      <div className="absolute inset-0 bg-[#FBF3F1]" />
      <div className="relative px-3 pb-3" style={{ color: P }}>
        <div className="flex items-end justify-between px-1">
          <div>
            <p className="text-[12px] font-semibold opacity-60 tracking-[0.12em] uppercase">Atelier Lune</p>
            <p className={`${SERIF} text-[30px] leading-tight`}>Thursday 16</p>
          </div>
          <span className="mb-1.5 text-[12px] font-semibold opacity-70">3 chairs</span>
        </div>
        <div className="mt-3 space-y-2">
          {[["9:00", "Mia", "Balayage · Chair 1", true], ["10:30", "Zoë", "Cut and blow-dry · Chair 2", false], ["12:00", "", "Free", false], ["13:15", "Ana", "Colour refresh · Chair 1", false]].map(([t, n, s, on]) => (
            <div key={t as string} className="flex gap-3 items-stretch">
              <span className="w-[42px] pt-2 text-[12px] font-semibold opacity-60 tabular-nums">{t as string}</span>
              {n ? (
                <div className="flex-1 rounded-[16px] px-3 py-2.5" style={on ? { background: P, color: "#FBF3F1" } : { background: K }}>
                  <p className={`${SERIF} text-[17px] leading-tight`}>{n as string}</p>
                  <p className="text-[12px] opacity-80">{s as string}</p>
                </div>
              ) : (
                <div className="flex-1 rounded-[16px] px-3 py-3 text-[12px] font-semibold" style={{ boxShadow: `inset 0 0 0 1.5px ${K}` }}>Free · bookable online</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-[16px] bg-white px-3 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-60">Mia&apos;s card</p>
          <p className={`${SERIF} text-[16px] mt-0.5`}>Formula 7.1 with 20 vol</p>
          <p className="text-[12px] opacity-70">Patch test done · prefers mornings</p>
        </div>
        <span className="mt-3 inline-flex items-center gap-2 h-[30px] px-3 rounded-full bg-white text-[12px] font-semibold">
          <Tick c={P} s={13} />Reminders sent for tomorrow
        </span>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ manufacturing: Ironbark Timber (tablet) */
function Manufacturing() {
  const Y = "#FFC727";
  const COND = "font-['DIN_Condensed','DIN_Alternate','Arial_Narrow','Roboto_Condensed',sans-serif]";
  const rows: [string, string, string, string][] = [["2417", "Pine poles 5 m", "09:40", "Pass"], ["2416", "Pine poles 7 m", "Mon", "Pass"], ["2415", "Fence droppers", "Mon", "Recheck"], ["2414", "Pine poles 5 m", "Fri", "Pass"]];
  return (
    <div className="w-[min(620px,100%)] rounded-[30px] p-[10px] bg-[#1A1A1C] [filter:drop-shadow(0_40px_50px_rgba(16,24,40,0.22))]">
      <div className="rounded-[22px] bg-[#0F0F10] text-white overflow-hidden">
        <div className={`h-[52px] px-5 flex items-center justify-between text-[#111] ${COND}`} style={{ background: Y }}>
          <span className="text-[20px] tracking-[0.06em] uppercase">Ironbark · Batch register</span>
          <span className="text-[16px] tracking-[0.04em] uppercase">Line 2</span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] gap-3">
          <div className="rounded-[16px] bg-[#1C1C1E] overflow-hidden">
            {rows.map(([b, p, t, s], i) => (
              <div key={b} className={`flex items-center gap-3 px-3.5 h-[52px] text-[13px] border-b border-white/5 ${i === 0 ? "bg-white/5" : ""}`}>
                <span className={`${COND} text-[18px] w-[42px] tabular-nums`} style={{ color: i === 0 ? Y : "#fff" }}>{b}</span>
                <span className="flex-1 text-white/80 truncate">{p}</span>
                <span className={`h-[22px] px-2 rounded-[6px] text-[11px] font-bold flex items-center ${s === "Pass" ? "text-[#111]" : "text-white bg-white/15"}`} style={s === "Pass" ? { background: Y } : undefined}>{s}</span>
              </div>
            ))}
          </div>
          <div className="rounded-[16px] bg-[#1C1C1E] p-3.5">
            <p className={`${COND} text-[22px] tracking-[0.03em]`} style={{ color: Y }}>BATCH 2417</p>
            <div className="mt-2 space-y-2 text-[13px]">
              {["Moisture checked", "Treatment cycle logged", "Photos of the load"].map((c) => (
                <p key={c} className="flex items-center gap-2"><span className="w-[20px] h-[20px] rounded-[6px] flex items-center justify-center text-[#111]" style={{ background: Y }}><Tick s={12} /></span>{c}</p>
              ))}
            </div>
            <div className={`mt-4 h-[42px] rounded-[12px] flex items-center justify-center text-[#111] text-[17px] tracking-[0.05em] uppercase ${COND}`} style={{ background: Y }}>Export report</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const APPS: Record<string, () => ReactNode> = { trades: Trades, transport: Transport, farms: Farms, salons: Salons, manufacturing: Manufacturing };

export function IndustryApp({ slug }: { slug: string }) {
  const App = APPS[slug];
  return App ? <App /> : null;
}
