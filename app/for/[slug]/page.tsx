import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeadCapture } from "@/components/LeadCapture";
import { IndustryApp } from "@/components/IndustryApp";
import { Container, H2, Lede, PrimaryButton, DarkButton, Check } from "@/components/ui";
import { industries, industryBySlug } from "@/lib/industries";

/*
 * /for/[slug]: one page per kind of business. The same promise as the homepage, told in that industry's words,
 * with an example app in its own brand. No invented stats; names and numbers in the example are made up.
 */

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return { robots: { index: false, follow: false } };
  return {
    title: ind.title,
    description: ind.description,
    alternates: { canonical: `/for/${ind.slug}` },
    openGraph: { title: ind.title, description: ind.description, url: `/for/${ind.slug}`, images: [{ url: "/og-home-v2.jpg", width: 1200, height: 630, alt: "Flowrate" }] },
  };
}

const STEPS: [string, string][] = [
  ["A free call", "You show us how the work runs today: the chats, the sheets, the paper."],
  ["We build it around you", "A simple app shaped to your jobs, your words and your team. You try it as it grows."],
  ["Your team uses it", "We set it up, show everyone how it works, and stay on hand for changes."],
];

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();
  const others = industries.filter((i) => i.slug !== ind.slug);

  return (
    <>
      <Navbar />
      <main className="bg-paper">
        {/* hero: the promise in this industry's words, and an example app in its own brand */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 bg-canvas border-b border-line overflow-hidden">
          <Container className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] items-center">
            <div>
              <h1 className="font-display uppercase text-heading text-[42px] sm:text-[58px] xl:text-[68px] leading-[0.96] tracking-[-0.03em] [text-wrap:balance]">{ind.h1}</h1>
              <p className="mt-6 text-[18px] sm:text-[20px] leading-[1.5] text-body max-w-[560px] [text-wrap:pretty]">{ind.sub}</p>
              <p className="mt-3 text-[16px] leading-[1.5] text-muted max-w-[560px]">Flowrate builds custom software for any business, around how you already work.</p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <PrimaryButton>Book a free call</PrimaryButton>
                <DarkButton href="/work">See apps we&apos;ve built</DarkButton>
              </div>
            </div>
            <div className="justify-self-center max-[399px]:[zoom:0.92] max-[369px]:[zoom:0.74]">
              <IndustryApp slug={ind.slug} />
              <p className="mt-5 text-center text-[13px] text-muted">An example app. Names and numbers are made up.</p>
            </div>
          </Container>
        </section>

        {/* the problems, in plain words */}
        <section className="py-20 md:py-28">
          <Container>
            <H2>Where the day leaks away</H2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {ind.pains.map((p, i) => (
                <div key={p} className="rounded-[20px] border border-line bg-soft p-6">
                  <span className="font-display text-[15px] text-muted tabular-nums">0{i + 1}</span>
                  <p className="mt-3 text-[19px] leading-[1.45] text-heading font-semibold [text-wrap:pretty]">{p}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* what we'd build */}
        <section className="py-20 md:py-28 bg-canvas border-y border-line">
          <Container>
            <H2>What we&apos;d build for you</H2>
            <Lede className="mt-4 max-w-[640px]">Every business runs a little differently, so this is a starting point. We shape it around your jobs, your words and your team.</Lede>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {ind.builds.map(([t, d]) => (
                <div key={t} className="rounded-[20px] bg-paper border border-line p-6 flex gap-4">
                  <span className="mt-0.5 w-8 h-8 shrink-0 rounded-[10px] bg-heading text-paper flex items-center justify-center"><Check className="w-4 h-4" /></span>
                  <div>
                    <p className="text-[19px] font-bold text-heading leading-tight">{t}</p>
                    <p className="mt-1.5 text-[16px] leading-[1.5] text-body">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* how a build works, short */}
        <section className="py-20 md:py-28">
          <Container>
            <H2>How it works</H2>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="rounded-[20px] border border-line p-6">
                  <span className="w-9 h-9 rounded-full bg-heading text-paper flex items-center justify-center font-bold text-[15px]">{i + 1}</span>
                  <p className="mt-4 text-[19px] font-bold text-heading">{t}</p>
                  <p className="mt-1.5 text-[16px] leading-[1.5] text-body">{d}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-[16px] text-body">
              Not your industry? We build for any business:{" "}
              {others.map((o, i) => (
                <span key={o.slug}>
                  <Link href={`/for/${o.slug}`} className="fr-ul font-semibold text-heading">{o.label.toLowerCase()}</Link>
                  {i < others.length - 1 ? ", " : ", and more."}
                </span>
              ))}
            </p>
          </Container>
        </section>

        <LeadCapture prefill={ind.prefill} />
      </main>
      <Footer />
    </>
  );
}
