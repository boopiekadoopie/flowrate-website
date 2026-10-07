"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container, H2, PrimaryButton, Reveal } from "./ui";

export function About() {
  return (
    <section id="about" className="bg-canvas py-20 md:py-28 overflow-x-clip">
      <Container>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-center">
          {/* Photo with the mascot leaning in from behind it */}
          <Reveal className="relative max-w-[420px] w-full mx-auto lg:mx-0">
            <div className="relative rounded-lg overflow-hidden border border-line bg-paper aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/andrew-portrait.png"
                alt="Andrew Murray, founder of Flowrate"
                className="w-full h-full object-cover object-[50%_20%]"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 24, rotate: 6 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-2 sm:-right-14 -bottom-6 w-[110px] sm:w-[150px]"
            >
              <Image
                src="/mascot.png"
                alt="The Flowrate mascot, a cartoon of Andrew"
                width={1002}
                height={1530}
                className="w-full h-auto drop-shadow-[0_12px_20px_rgba(16,24,40,0.25)]"
              />
            </motion.div>
          </Reveal>

          <div>
            <H2 className="mb-7">You&apos;ll deal with the person who builds it.</H2>
            <Reveal className="space-y-5 text-body text-[17px] leading-[1.65] max-w-[560px]">
              <p>
                I&apos;m Andrew Murray, founder of Flowrate. The cartoon in our logo is
                me.
              </p>
              <p>
                Before I built software, I did the work it replaces: the paperwork, the
                retyping, the chasing at month-end. That&apos;s why every Flowrate system
                starts with how your job actually runs, not with a feature list.
              </p>
              <p>
                When you book a call, it&apos;s with me. You&apos;ll be talking to the
                person who designs your system and builds it.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-9 flex flex-col sm:flex-row sm:items-end gap-7 sm:gap-10">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/signature-white.png" alt="Andrew Murray's signature" className="w-36 h-auto invert mb-1" />
                <p className="text-heading font-bold text-[15px]">Andrew Murray</p>
                <p className="text-muted text-[14px]">Founder, Flowrate</p>
              </div>
              <PrimaryButton>Book a call with Andrew</PrimaryButton>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
