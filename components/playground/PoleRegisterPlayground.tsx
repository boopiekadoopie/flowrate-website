"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Check } from "@/components/ui";
import { EASE, Hl, Steps, useTimers } from "./kit";

/*
 * Playground 3: the quality register we built for a timber treatment plant, rebuilt as a safe demo.
 * Same idea as the real one: photograph the handwritten inspection sheet, a person checks every figure that was
 * read from it (nothing is accepted without a person), then any pole can be found by its number and a
 * certificate is built only from checked records (unchecked = draft). Made-up sheet, poles and dates.
 */

const SHEET = { no: "70214", charge: "612", size: "9 m × 160–179 mm", treated: "3 Oct 2026", inspected: "4 Oct 2026" };
const MIN = 15;
type Row = { pole: string; pen: number; read: number; col: number; row: number };
const ROWS: Row[] = [
  ["40311", 17], ["40312", 18], ["40313", 16], ["40314", 19], ["40315", 17], ["40316", 19],
  ["40317", 18], ["40318", 16], ["40319", 18], ["40320", 17], ["40321", 20], ["40322", 16],
].map(([pole, pen], i) => ({ pole: pole as string, pen: pen as number, read: pen as number, col: i < 6 ? 1 : 2, row: (i % 6) + 1 }));
// what the machine read wrong (the person catches these)
ROWS[5].read = 15; // a 19 read as 15
ROWS[8].read = 13; // an 18 read as 13: under the minimum, so it's flagged

type Tab = "capture" | "check" | "search" | "cert";
const TABS: [Tab, string][] = [["capture", "Capture"], ["check", "Check"], ["search", "Search"], ["cert", "Certificate"]];
const STEPS = [
  { key: "capture", label: "Photograph the sheet", hint: "Tap Photograph page" },
  { key: "check", label: "Check the flagged figures", hint: "Compare with the photo and pick the right number" },
  { key: "search", label: "Find any pole", hint: "Search a pole number, like 40317" },
  { key: "cert", label: "Make a certificate", hint: "Build a certificate for a delivery" },
];

const HAND = "[font-family:'Bradley_Hand','Marker_Felt','Segoe_Print',cursive]";

/* The paper sheet, as photographed. */
function Sheet({ small = false, focus }: { small?: boolean; focus?: string[] }) {
  return (
    <div className={`bg-[#FBFAF6] text-[#1E3A8A] ring-1 ring-[#E7E3D8] shadow-[0_10px_24px_rgba(16,24,40,0.12)] ${small ? "p-2.5 w-[230px]" : "p-4 w-full"}`}>
      <div className={`flex justify-between font-sans text-[#4A5565] ${small ? "text-[8px]" : "text-[10px]"} font-bold tracking-wide`}>
        <span>FINAL INSPECTION</span><span>SHEET {SHEET.no}</span>
      </div>
      <p className={`${HAND} ${small ? "text-[11px]" : "text-[15px]"} mt-1`}>Charge {SHEET.charge} · {SHEET.size}</p>
      <div className={`grid grid-cols-2 ${small ? "gap-2 mt-1.5" : "gap-4 mt-3"}`}>
        {[1, 2].map((c) => (
          <div key={c}>
            <div className={`grid grid-cols-2 font-sans text-[#6A7282] border-b border-[#D8D3C6] ${small ? "text-[7px]" : "text-[9px]"} font-bold`}>
              <span>POLE</span><span className="text-right">PEN mm</span>
            </div>
            {ROWS.filter((r) => r.col === c).map((r) => (
              <div key={r.pole} className={`grid grid-cols-2 border-b border-[#ECE8DD] ${HAND} ${small ? "text-[11px] h-[17px]" : "text-[16px] h-[27px]"} items-center ${focus?.includes(r.pole) ? "bg-[#FEF3C7]" : ""}`}>
                <span>{r.pole}</span><span className="text-right pr-1">{r.pen}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PoleRegisterPlayground() {
  const [tab, setTab] = useState<Tab>("capture");
  const [shot, setShot] = useState<"none" | "flash" | "done">("none");
  const [fix, setFix] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const [q, setQ] = useState("");
  const [found, setFound] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [cert, setCert] = useState(false);
  const [auto, setAuto] = useState(false);
  const { later, clear } = useTimers();

  const flagged = useMemo(() => ROWS.filter((r) => r.read !== r.pen), []);
  const allFixed = flagged.every((r) => fix[r.pole] !== undefined);
  const step = cert ? "done" : shot !== "done" ? "capture" : !checked ? "check" : !found ? "search" : "cert";

  const photograph = () => {
    if (shot !== "none") return;
    setShot("flash");
    later(900, () => setShot("done"));
  };
  const search = (val = q) => {
    const v = val.trim().replace(/\D/g, "");
    setSearched(true);
    setFound(ROWS.some((r) => r.pole === v) ? v : null);
  };
  const reset = () => {
    clear(); setTab("capture"); setShot("none"); setFix({}); setChecked(false); setQ(""); setFound(null); setSearched(false); setCert(false); setAuto(false);
  };
  const watch = () => {
    reset(); setAuto(true);
    const seq: [number, () => void][] = [
      [600, () => setShot("flash")],
      [1500, () => setShot("done")],
      [2300, () => setTab("check")],
      [3100, () => setFix((f) => ({ ...f, "40316": 19 }))],
      [3800, () => setFix((f) => ({ ...f, "40319": 18 }))],
      [4500, () => setChecked(true)],
      [5200, () => setTab("search")],
      [5600, () => setQ("40317")],
      [6200, () => { setSearched(true); setFound("40317"); }],
      [7600, () => setTab("cert")],
      [8300, () => { setCert(true); setAuto(false); }],
    ];
    seq.forEach(([ms, fn]) => later(ms, fn));
  };

  const pole = found ? ROWS.find((r) => r.pole === found)! : null;
  const value = (r: Row) => (r.read !== r.pen ? fix[r.pole] ?? r.read : r.pen);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:gap-8 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
      <Steps steps={STEPS} current={step} allDone={step === "done"} auto={auto} onWatch={watch} onReset={reset}
        note={{ title: "The paper book stays", body: "Inspectors keep writing on the same sheets. The register indexes them, and every record links back to the photo of the page it came from." }} />

      <div className="min-w-0 rounded-[18px] bg-white border border-[#E5E7EB] overflow-hidden text-[#101828] [filter:drop-shadow(0_30px_40px_rgba(16,24,40,0.12))]" data-theme="light">
        {/* app bar */}
        <div className="flex items-center gap-1 px-3 sm:px-4 border-b border-[#E5E7EB] bg-[#FAFAFA] overflow-x-auto [scrollbar-width:none]">
          <p className="mr-3 py-3 text-[13px] font-extrabold tracking-tight whitespace-nowrap">Pole register</p>
          {TABS.map(([k, label]) => (
            <button key={k} type="button" onClick={() => setTab(k)} className={`relative px-3 py-3.5 text-[13px] font-semibold whitespace-nowrap cursor-pointer ${tab === k ? "text-[#101828]" : "text-[#6A7282]"}`}>
              {label}
              {tab === k && <motion.span layoutId="pr-tab" className="absolute left-2 right-2 bottom-0 h-[3px] rounded-full bg-[#101828]" />}
            </button>
          ))}
          <span className="ml-auto pl-3 text-[12px] text-[#6A7282] whitespace-nowrap">Example data</span>
        </div>

        <div className="p-4 sm:p-6 min-h-[520px]">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "capture" && (
              <motion.div key="capture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }} className="grid gap-6 md:grid-cols-[1fr_250px] items-start">
                <div>
                  <p className="text-[20px] font-extrabold tracking-tight">Photograph a page</p>
                  <p className="mt-1 text-[14px] text-[#4A5565] leading-relaxed">Whole page in frame. The phone checks the photo before it&apos;s sent, so if it&apos;s blurry you&apos;re still standing at the sheet.</p>
                  <Hl on={step === "capture" && !auto} className="mt-5">
                    <button type="button" onClick={photograph} disabled={shot !== "none"} className="w-full h-[54px] rounded-[12px] bg-[#101828] text-white text-[14px] font-extrabold tracking-wide disabled:opacity-60 cursor-pointer">
                      {shot === "none" ? "Photograph page" : shot === "flash" ? "Checking the photo…" : "Photo sent"}
                    </button>
                  </Hl>
                  <AnimatePresence>
                    {shot === "done" && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} className="mt-4 space-y-2 text-[13px]">
                        {["Sharp and flat: no need to take it again", `Sheet ${SHEET.no} · ${ROWS.length} poles read from the page`, `${flagged.length} figures need a person to check them`].map((t, i) => (
                          <motion.p key={t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15, duration: 0.3 }} className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-[6px] flex items-center justify-center ${i === 2 ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF8E6] text-[#1D6B2B]"}`}>{i === 2 ? "!" : <Check className="w-3 h-3" />}</span>
                            {t}
                          </motion.p>
                        ))}
                        <button type="button" onClick={() => setTab("check")} className="mt-2 h-[40px] px-4 rounded-[10px] border border-[#D4D4D4] text-[13px] font-bold cursor-pointer">Check the figures →</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative justify-self-center">
                  <div className={`transition-all duration-500 ${shot === "none" ? "opacity-40 blur-[1px]" : ""}`} style={{ transform: "rotate(-2deg)" }}>
                    <Sheet small />
                  </div>
                  {shot === "flash" && <motion.span initial={{ opacity: 0.95 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 bg-white" />}
                </div>
              </motion.div>
            )}

            {tab === "check" && (
              <motion.div key="check" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                {shot !== "done" ? (
                  <p className="text-[14px] text-[#4A5565]">Photograph a sheet first, then its figures show up here to check.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-[1fr_1fr] items-start">
                    <div>
                      <p className="text-[20px] font-extrabold tracking-tight">Check sheet {SHEET.no}</p>
                      <p className="mt-1 text-[14px] text-[#4A5565] leading-relaxed">Two figures don&apos;t look right. Compare each one with the photo and pick what&apos;s written.</p>
                      <div className="mt-4 space-y-2.5">
                        {flagged.map((r) => {
                          const pick = fix[r.pole];
                          const options = [r.read, r.pen];
                          return (
                            <Hl key={r.pole} on={step === "check" && pick === undefined && !auto && r === flagged.find((x) => fix[x.pole] === undefined)}>
                              <div className={`rounded-[12px] border p-3 ${pick !== undefined ? "border-[#ABEFC6] bg-[#F6FEF9]" : "border-[#FEDF89] bg-[#FFFCF5]"}`}>
                                <p className="text-[13px] font-bold">Pole {r.pole} <span className="font-normal text-[#4A5565]">· read as {r.read} mm{r.read < MIN ? `, under the ${MIN} mm minimum` : ""}</span></p>
                                <div className="mt-2 flex gap-2">
                                  {options.map((o) => (
                                    <button key={o} type="button" onClick={() => setFix((f) => ({ ...f, [r.pole]: o }))} className={`h-[36px] min-w-[64px] px-3 rounded-[9px] border text-[14px] font-bold tabular-nums cursor-pointer ${pick === o ? "bg-[#101828] border-[#101828] text-white" : "bg-white border-[#D4D4D4]"}`}>
                                      {o} mm
                                    </button>
                                  ))}
                                </div>
                                {pick !== undefined && pick !== r.pen && <p className="mt-2 text-[12px] text-[#B42318]">Look again: the photo shows {r.pen}.</p>}
                              </div>
                            </Hl>
                          );
                        })}
                      </div>
                      <Hl on={step === "check" && allFixed && !checked && !auto} className="mt-4">
                        <button type="button" onClick={() => setChecked(true)} disabled={!allFixed || flagged.some((r) => fix[r.pole] !== r.pen) || checked} className="w-full h-[46px] rounded-[12px] bg-[#101828] text-white text-[14px] font-extrabold disabled:opacity-40 cursor-pointer">
                          {checked ? "✓ Sheet checked" : "Mark sheet as checked"}
                        </button>
                      </Hl>
                      {checked && <button type="button" onClick={() => setTab("search")} className="mt-3 h-[40px] px-4 rounded-[10px] border border-[#D4D4D4] text-[13px] font-bold cursor-pointer">Find a pole →</button>}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.1em] text-[#6A7282] mb-2">THE PHOTO</p>
                      <Sheet focus={flagged.map((r) => r.pole)} />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {tab === "search" && (
              <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                <form onSubmit={(e) => { e.preventDefault(); search(); }} className="flex gap-2">
                  <Hl on={step === "search" && !auto} className="flex-1">
                    <input value={q} onChange={(e) => setQ(e.target.value)} inputMode="numeric" placeholder="Pole number, like 40317" aria-label="Pole number" className="w-full h-[50px] rounded-[12px] border border-[#D4D4D4] px-4 text-[16px] font-semibold tabular-nums outline-none focus:border-[#101828]" />
                  </Hl>
                  <button type="submit" className="h-[50px] px-5 rounded-[12px] bg-[#101828] text-white text-[14px] font-extrabold cursor-pointer">Search</button>
                </form>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[12px] text-[#6A7282] items-center">
                  Try:
                  {["40317", "40319", "40321"].map((p) => (
                    <button key={p} type="button" onClick={() => { setQ(p); search(p); }} className="h-[34px] px-3 rounded-full border border-[#E5E7EB] font-semibold text-[#101828] tabular-nums cursor-pointer">{p}</button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {pole ? (
                    <motion.div key={pole.pole} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="mt-5 rounded-[14px] border border-[#E5E7EB] overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EEF0F2]">
                        <p className="text-[24px] font-extrabold tabular-nums">{pole.pole}</p>
                        <span className="rounded-full px-2.5 h-[24px] flex items-center text-[12px] font-bold bg-[#EAF8E6] text-[#1D6B2B]">Passed</span>
                        <span className={`rounded-full px-2.5 h-[24px] flex items-center text-[12px] font-bold ${checked ? "bg-[#EEF2F7] text-[#334155]" : "bg-[#FEF3C7] text-[#92400E]"}`}>{checked ? "Checked" : "Not checked yet"}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4">
                        {[
                          ["Penetration", `${value(pole)} mm`, `minimum ${MIN} mm`],
                          ["Size", SHEET.size, ""],
                          ["Charge", SHEET.charge, `treated ${SHEET.treated}`],
                          ["Where on the page", `Sheet ${SHEET.no}`, `column ${pole.col}, row ${pole.row}`],
                        ].map(([k, v, s]) => (
                          <div key={k} className="px-5 py-3.5 border-b sm:border-b-0 border-r border-[#F3F4F6]">
                            <p className="text-[11px] font-bold tracking-wide text-[#6A7282]">{k.toUpperCase()}</p>
                            <p className="mt-1 text-[15px] font-bold tabular-nums">{v}</p>
                            {s && <p className="text-[12px] text-[#6A7282]">{s}</p>}
                          </div>
                        ))}
                      </div>
                      <div className="px-5 py-3 bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-2 text-[13px]">
                        <span className="text-[#4A5565]">Inspected {SHEET.inspected} · links to the photo of the page</span>
                        <button type="button" onClick={() => setTab("cert")} className="h-[36px] px-4 rounded-[10px] border border-[#D4D4D4] bg-white font-bold cursor-pointer">Certificate →</button>
                      </div>
                    </motion.div>
                  ) : searched ? (
                    <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-[14px] text-[#4A5565]">That pole isn&apos;t in this demo. Try one of the numbers above.</motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            )}

            {tab === "cert" && (
              <motion.div key="cert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }} className="grid gap-6 md:grid-cols-[1fr_1.1fr] items-start">
                <div>
                  <p className="text-[20px] font-extrabold tracking-tight">Certificate for a delivery</p>
                  <p className="mt-1 text-[14px] text-[#4A5565] leading-relaxed">List the poles going out. The certificate is built only from checked records. Anything not checked yet prints as a draft.</p>
                  <div className="mt-4 rounded-[12px] border border-[#D4D4D4] p-3 text-[14px] font-mono text-[#364153] leading-relaxed">40314 40317 40319 40321</div>
                  <Hl on={step === "cert" && !auto} className="mt-3">
                    <button type="button" onClick={() => setCert(true)} className="w-full h-[46px] rounded-[12px] bg-[#101828] text-white text-[14px] font-extrabold cursor-pointer">Build the certificate</button>
                  </Hl>
                </div>
                <div className="relative min-h-[340px]">
                  <AnimatePresence>
                    {cert ? (
                      <motion.div initial={{ opacity: 0, y: 30, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 24 }} className="relative bg-white ring-1 ring-[#E5E7EB] shadow-[0_24px_40px_rgba(16,24,40,0.16)] p-5">
                        {!checked && <span className="absolute right-4 top-4 rotate-[8deg] border-2 border-[#B42318] text-[#B42318] text-[12px] font-extrabold tracking-[0.15em] px-2 py-0.5">DRAFT</span>}
                        <p className="text-[10px] font-bold tracking-[0.14em] text-[#6A7282]">FINAL INSPECTION CERTIFICATE</p>
                        <p className="mt-1 text-[17px] font-extrabold">Delivery of 4 poles</p>
                        <div className="mt-3 text-[12px]">
                          <div className="grid grid-cols-[60px_1fr_70px_1fr] gap-2 font-bold text-[#6A7282] border-b border-[#E5E7EB] pb-1.5">
                            <span>Pole</span><span>Charge</span><span className="text-right">Pen.</span><span className="text-right">From</span>
                          </div>
                          {["40314", "40317", "40319", "40321"].map((p, i) => {
                            const r = ROWS.find((x) => x.pole === p)!;
                            return (
                              <motion.div key={p} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className="grid grid-cols-[60px_1fr_70px_1fr] gap-2 py-1.5 border-b border-[#F3F4F6] tabular-nums">
                                <span className="font-semibold">{p}</span><span>{SHEET.charge}</span><span className="text-right">{value(r)} mm</span><span className="text-right text-[#6A7282]">sheet {SHEET.no} c{r.col} r{r.row}</span>
                              </motion.div>
                            );
                          })}
                        </div>
                        <p className="mt-3 text-[11px] text-[#6A7282]">{checked ? "Every line cites the page it came from." : `Draft: sheet ${SHEET.no} hasn't been checked yet.`}</p>
                      </motion.div>
                    ) : (
                      <div className="h-[340px] rounded-[12px] border-2 border-dashed border-[#E5E7EB] flex items-center justify-center text-[13px] text-[#99A1AF]">The certificate shows up here</div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
