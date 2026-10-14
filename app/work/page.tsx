import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { ReactNode } from "react";
import { DriverPlayground } from "@/components/playground/DriverPlayground";
import { ChecklistPlayground } from "@/components/playground/ChecklistPlayground";
import { PoleRegisterPlayground } from "@/components/playground/PoleRegisterPlayground";
import { WorkSwitcher } from "@/components/playground/WorkSwitcher";
import { PrimaryButton } from "@/components/ui";

/* Our work: working demos of apps we've built, with made-up data. */
export const metadata: Metadata = {
  title: "Our work | Flowrate",
  description: "Try working demos of apps and systems we've built for real businesses. Made-up data, nothing you tap goes anywhere.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Our work | Flowrate", url: "/work" },
};

const X = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden><path d="M4.5 4.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
);
const Tick = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

type Story = {
  before: { title: string; msgs: { who: string; text: string; time: string }[]; cons: string[] };
  now: { title: string; rows: [string, string, string, string][]; pros: string[] };
  who: string;
};

/* Before vs now: the old way looks like what it was (scattered, dashed, muted); the new way is one solid, clean card. */
function BeforeNow({ story }: { story: Story }) {
  const tilt = [-2, 1.5, -1];
  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_56px_1fr] items-stretch [&>*]:min-w-0">
        <div className="rounded-2xl border-2 border-dashed border-line-strong bg-soft p-6">
          <span className="inline-flex items-center h-7 px-3 rounded-full bg-line text-muted text-[13px] font-bold">Before</span>
          <p className="mt-3 text-[20px] font-bold text-muted leading-snug">{story.before.title}</p>
          <div className="mt-4 space-y-2 opacity-80">
            {story.before.msgs.map((m, i) => (
              <div key={m.text} className="w-fit max-w-[85%] rounded-[14px] rounded-tl-[4px] bg-paper border border-line px-3.5 py-2" style={{ transform: `rotate(${tilt[i % 3]}deg)` }}>
                <p className="text-[11px] font-semibold text-muted">{m.who}</p>
                <p className="text-[14px] text-body">{m.text} <span className="text-[11px] text-faint tabular-nums ml-1">{m.time}</span></p>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2 text-[14px] text-body">
            {story.before.cons.map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="w-6 h-6 shrink-0 rounded-[7px] bg-[#FEE4E2] text-[#B42318] flex items-center justify-center"><X /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center" aria-hidden>
          <span className="w-12 h-12 rounded-[14px] bg-heading text-paper flex items-center justify-center rotate-90 md:rotate-0">
            <svg viewBox="0 0 20 20" className="w-5 h-5"><path d="M3 10h13m0 0l-5-5m5 5l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>

        <div className="rounded-2xl bg-[#101828] text-white dark:bg-white dark:text-[#101828] p-6 shadow-[0_24px_48px_rgba(16,24,40,0.18)]">
          <span className="inline-flex items-center h-7 px-3 rounded-full bg-white text-[#101828] dark:bg-[#101828] dark:text-white text-[13px] font-bold">Now</span>
          <p className="mt-3 text-[20px] font-bold leading-snug">{story.now.title}</p>
          <div className="mt-4 rounded-[14px] bg-white/[0.07] dark:bg-[#101828]/[0.05] ring-1 ring-white/10 dark:ring-[#101828]/10 overflow-hidden">
            {story.now.rows.map(([a, b, c, chip]) => (
              <div key={a + b} className="flex items-center gap-3 px-3.5 h-[44px] border-b border-white/10 dark:border-[#101828]/10 last:border-b-0 text-[13px]">
                <span className="font-semibold tabular-nums w-[56px]">{a}</span>
                <span className="hidden sm:block opacity-70 w-[64px] truncate">{b}</span>
                <span className="hidden sm:block opacity-70 flex-1 min-w-0 truncate">{c}</span>
                <span className="ml-auto rounded-full px-2.5 h-[22px] flex items-center text-[11.5px] font-semibold bg-white/12 dark:bg-[#101828]/8 whitespace-nowrap">{chip}</span>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2 text-[14px]">
            {story.now.pros.map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="w-6 h-6 shrink-0 rounded-[7px] bg-white text-[#101828] dark:bg-[#101828] dark:text-white flex items-center justify-center"><Tick /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-5 text-[14px] text-body">
        <span className="font-semibold text-heading">Who uses it:</span> {story.who}
      </p>
    </div>
  );
}

const PROJECTS: { id: string; who: string; name: string; line: string; device: "phone" | "desktop"; lede: string; demo: ReactNode; story: Story }[] = [
  {
    id: "driver-app",
    who: "Built for a logistics company",
    name: "The driver app",
    line: "Load documents sent from the road, straight to the office.",
    device: "phone",
    lede: "Drivers send every load's documents from their phone. The office gets them straight away, ready to invoice.",
    demo: <DriverPlayground />,
    story: {
      before: {
        title: "Chasing photos in the group chat",
        msgs: [
          { who: "Driver", text: "IMG_2231.jpg", time: "14:02" },
          { who: "Office", text: "Which truck was this one?", time: "15:40" },
          { who: "Office", text: "Did anyone send the seal photo??", time: "17:15" },
        ],
        cons: ["Photos buried in WhatsApp", "Matched to the right truck by hand", "Typed into the accounts, one by one"],
      },
      now: {
        title: "Every load in one list, ready to invoice",
        rows: [["#2417", "TNK 05", "Sam M.", "Invoice drafted"], ["#2416", "TNK 05", "Ana P.", "Invoice drafted"], ["#2415", "TIP 07", "Lee K.", "Invoice drafted"]],
        pros: ["Sent from the app, even with no signal", "Photos attached to the right truck", "Invoice drafted, nothing typed twice"],
      },
      who: "drivers out on the road, and the office team that does the invoicing. No training needed, it works like any app on their phone.",
    },
  },
  {
    id: "workshop-checklist",
    who: "Built for a transport fleet's workshop",
    name: "The pre-start checklist",
    line: "Daily machine checks on the phone or on paper.",
    device: "phone",
    lede: "Operators check their machine on their phone before they start. A fault on anything that matters stops the truck, and the supervisor gets the report.",
    demo: <ChecklistPlayground />,
    story: {
      before: {
        title: "A paper form for every check",
        msgs: [
          { who: "Supervisor", text: "Did anyone check TRK 04 this morning?", time: "06:55" },
          { who: "Operator", text: "Form's in the cab somewhere", time: "07:02" },
          { who: "Workshop", text: "Who said the brakes were soft?", time: "11:30" },
        ],
        cons: ["Faults passed on by word of mouth", "Hard to see which machines were checked", "Forms that are easy to lose"],
      },
      now: {
        title: "Every check on the phone, every fault named",
        rows: [["TRK 04", "Sam M.", "6:42", "Do not start"], ["TRK 07", "Lee K.", "6:50", "1 fault"], ["FWD 02", "Ana P.", "6:58", "Safe to start"]],
        pros: ["The same list on the phone and on paper", "A brake or steering fault says: do not start", "Sent to the supervisor on WhatsApp"],
      },
      who: "machine operators at the start of each shift, and the supervisor and workshop who fix what they find.",
    },
  },
  {
    id: "pole-register",
    who: "Built for a timber treatment plant",
    name: "The quality register",
    line: "Handwritten sheets turned into a searchable record.",
    device: "desktop",
    lede: "Handwritten inspection sheets are photographed and checked, so any pole can be found by its number and a certificate is ready in seconds.",
    demo: <PoleRegisterPlayground />,
    story: {
      before: {
        title: "Results only in the paper books",
        msgs: [
          { who: "Sales", text: "Which sheet was pole 40317 on?", time: "09:10" },
          { who: "QC", text: "Somewhere in the October book", time: "09:45" },
          { who: "Sales", text: "Customer needs the certificate today", time: "10:20" },
        ],
        cons: ["Finding one pole meant paging through books", "Certificates put together by hand", "No quick way to spot a bad reading"],
      },
      now: {
        title: "Every pole one search away",
        rows: [["40317", "18 mm", "Sheet 70214", "Passed"], ["40319", "18 mm", "Sheet 70214", "Passed"], ["40321", "20 mm", "Sheet 70214", "Passed"]],
        pros: ["Every figure checked by a person against the photo", "Any pole found by its number", "Certificates built from checked records only"],
      },
      who: "the quality team who inspect and record the poles, and the office that sends certificates to customers.",
    },
  },
];

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main className="bg-canvas">
        <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-36 sm:pt-44 pb-10">
          <h1 className="font-display text-heading uppercase text-[36px] sm:text-[52px] lg:text-[64px] leading-[0.98] tracking-[-0.025em] max-w-[880px] [text-wrap:balance]">
            See what we build. Then try it.
          </h1>
          <p className="mt-6 text-[17px] md:text-[19px] leading-[1.6] text-body max-w-[680px] [text-wrap:pretty]">
            These are working demos of apps we&apos;ve built for real businesses, with made-up names and numbers. Tap
            around as much as you like. Nothing you do here goes anywhere.
          </p>
        </section>

        <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pb-24">
          <WorkSwitcher
            items={PROJECTS.map((pr) => ({
              id: pr.id,
              name: pr.name,
              who: pr.who,
              line: pr.line,
              device: pr.device,
              content: (
                <div className="rounded-[28px] bg-paper border border-line p-5 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-8 lg:mb-10">
                    <div>
                      <p className="text-[14px] font-semibold text-muted">{pr.who}</p>
                      <h2 className="mt-1 font-display uppercase text-heading text-[28px] sm:text-[36px] leading-[1.02] tracking-[-0.02em]">{pr.name}</h2>
                    </div>
                    <p className="text-[15px] text-body max-w-[460px]">{pr.lede}</p>
                  </div>
                  {pr.demo}
                  <BeforeNow story={pr.story} />
                </div>
              ),
            }))}
          />
          <div className="mt-14 flex flex-wrap items-center gap-5">
            <PrimaryButton>Book a free call</PrimaryButton>
            <p className="text-[15px] text-body">Want something like this for your business? We&apos;ll build it around how you already work.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
