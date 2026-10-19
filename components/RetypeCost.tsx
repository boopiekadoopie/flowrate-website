"use client";
import { useEffect, useId, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Container, H2, Lede, PrimaryButton } from "./ui";

/*
 * What the retyping costs: three sliders, one sum. Every number in the answer comes from what the visitor sets,
 * and the sum itself is printed under the result, so nothing here is a claim of ours. No currency symbol: the
 * hourly cost is in whatever money they think in. The sliders are ink, because green stays for booking.
 */

const DAYS = 230; // working days in a year, stated in the sum
const WEEK = 40; // hours in a working week, stated in the sum

function Slider({ label, hint, value, set, min, max, step = 1, unit }: { label: string; hint?: string; value: number; set: (n: number) => void; min: number; max: number; step?: number; unit?: string }) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-2.5">
        <label htmlFor={id} className="text-[15px] font-semibold text-heading">{label}</label>
        <output htmlFor={id} className="text-[15px] font-semibold tabular-nums text-heading whitespace-nowrap">
          {value}{unit ? ` ${unit}` : ""}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="fr-range w-full"
        style={{ ["--fill" as string]: `${fill}%` }}
      />
      {hint && <p className="mt-1.5 text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

function Rolling({ value, className = "" }: { value: number; className?: string }) {
  const s = useSpring(value, { stiffness: 140, damping: 24 });
  useEffect(() => s.set(value), [s, value]);
  const text = useTransform(s, (v) => Math.round(v).toLocaleString("en"));
  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>;
}

export function RetypeCost() {
  const [people, setPeople] = useState(3);
  const [minutes, setMinutes] = useState(30);
  const [rate, setRate] = useState(25);
  const hours = Math.round((people * minutes * DAYS) / 60);
  const weeks = Math.round(hours / WEEK);
  const money = hours * rate;

  return (
    <section id="retyping-cost" className="bg-paper py-20 md:py-28 border-t border-line">
      <Container>
        <div className="max-w-[760px] mb-10 md:mb-14">
          <H2 className="mb-4">What does the retyping cost you?</H2>
          <Lede>
            Set the sliders to match a normal week. The answer is your own numbers added up, nothing of ours.
          </Lede>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] rounded-2xl border border-line bg-soft overflow-hidden">
          <div className="p-6 sm:p-10 space-y-8">
            <Slider label="People who copy the same information twice" value={people} set={setPeople} min={1} max={30} hint="From WhatsApp to a spreadsheet, from the spreadsheet to the accounts." />
            <Slider label="Minutes each, per day" value={minutes} set={setMinutes} min={5} max={120} step={5} unit="min" hint="Retyping, copying across, chasing who did what." />
            <Slider label="What an hour of their time costs" value={rate} set={setRate} min={0} max={150} step={5} hint="In your own currency. Leave it at 0 to see hours only." />
          </div>

          <div className="bg-[#101828] dark:bg-[#0B0B0D] dark:border-l dark:border-white/10 text-white p-6 sm:p-10 flex flex-col">
            <p className="text-white/70 text-[15px]">Hours a year spent typing things in twice</p>
            <p className="font-display text-[56px] sm:text-[72px] leading-none tracking-[-0.02em] mt-3">
              <Rolling value={hours} />
            </p>
            <p className="mt-4 text-[17px] text-white/90 [text-wrap:pretty]">
              That&apos;s about <strong className="font-semibold text-white"><Rolling value={weeks} /> full working weeks</strong>
              {rate > 0 && (
                <>
                  , or roughly <strong className="font-semibold text-white"><Rolling value={money} /></strong> a year
                </>
              )}
              .
            </p>
            <p className="mt-5 pt-4 border-t border-white/15 text-[13px] text-white/55 tabular-nums">
              {people} {people === 1 ? "person" : "people"} × {minutes} min × {DAYS} working days ÷ 60 = {hours.toLocaleString("en")} h
              {" "}· ÷ {WEEK} h a week = {weeks} weeks{rate > 0 ? ` · × ${rate} an hour = ${money.toLocaleString("en")}` : ""}
            </p>
            <div className="mt-auto pt-8">
              <p className="text-[15px] text-white/80 mb-4">On a free call we&apos;ll look at which of those hours a system can take off your hands.</p>
              <PrimaryButton className="w-full sm:w-auto">
                Book a free call
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
