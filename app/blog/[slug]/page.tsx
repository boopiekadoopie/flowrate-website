import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrimaryButton } from "@/components/ui";
import { posts, postBySlug, fmtDate, readMinutes, nextPost } from "@/lib/posts";
import { ReadProgress } from "@/components/ReadProgress";
import { industries } from "@/lib/industries";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return { robots: { index: false, follow: false } };
  return {
    title: `${p.title} | Flowrate`,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.description, url: `/blog/${p.slug}`, type: "article", images: [{ url: p.cover, width: 1080, height: 1350, alt: p.coverAlt }] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();
  const next = nextPost(p.slug);
  const more = posts.filter((x) => x.slug !== p.slug && x.slug !== next.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    image: `https://flowrate.agency${p.cover}`,
    author: { "@type": "Person", name: "Andrew Murray" },
    publisher: { "@type": "Organization", name: "Flowrate", logo: { "@type": "ImageObject", url: "https://flowrate.agency/icon.png" } },
    mainEntityOfPage: `https://flowrate.agency/blog/${p.slug}`,
  };

  return (
    <>
      <Navbar />
      <ReadProgress target="guide" />
      <main className="bg-paper pt-32 md:pt-40 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <article id="guide" className="max-w-[720px] mx-auto px-5 sm:px-8">
          <Link href="/blog" className="fr-ul text-[14px] font-semibold text-body hover:text-heading">← All guides</Link>
          <h1 className="mt-6 font-display uppercase text-heading text-[34px] sm:text-[46px] leading-[1.0] tracking-[-0.025em] [text-wrap:balance]">{p.title}</h1>
          <p className="mt-4 text-[14px] text-muted">{fmtDate(p.date)} · {readMinutes(p)} min read · Andrew Murray, Flowrate</p>
          <div className="mt-8 relative aspect-[4/5] max-w-[520px] rounded-[22px] overflow-hidden border border-line">
            <Image src={p.cover} alt={p.coverAlt} fill priority sizes="(min-width: 640px) 520px, 100vw" className="object-cover" />
          </div>
          <div className="mt-10 space-y-6">
            {p.body.map((b, i) => {
              if (b.t === "p") return <p key={i} className="text-[18px] leading-[1.7] text-body [text-wrap:pretty]">{b.text}</p>;
              if (b.t === "h2") return <h2 key={i} className="pt-4 text-[26px] leading-[1.2] font-bold text-heading tracking-[-0.01em]">{b.text}</h2>;
              if (b.t === "list")
                return (
                  <ul key={i} className="space-y-3">
                    {b.items.map(([k, v]) => (
                      <li key={k} className="text-[18px] leading-[1.6] text-body pl-5 relative">
                        <span aria-hidden className="absolute left-0 top-[0.7em] w-2 h-2 rounded-[3px] bg-heading" />
                        <strong className="text-heading">{k}</strong> {v}
                      </li>
                    ))}
                  </ul>
                );
              return (
                <figure key={i} className="relative aspect-[4/5] max-w-[440px] rounded-[18px] overflow-hidden border border-line">
                  <Image src={b.src} alt={b.alt} fill sizes="(min-width: 640px) 440px, 100vw" className="object-cover" />
                </figure>
              );
            })}
          </div>
          <Link href={`/blog/${next.slug}`} className="group mt-14 flex items-center gap-4 sm:gap-5 rounded-[22px] border border-line p-3 pr-5 sm:pr-6 hover:border-line-strong transition-colors">
            <span className="relative shrink-0 w-[72px] sm:w-[88px] aspect-[4/5] rounded-[14px] overflow-hidden border border-line">
              <Image src={next.cover} alt="" fill sizes="88px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] text-muted">Read next · {readMinutes(next)} min</span>
              <span className="mt-1 block text-[17px] sm:text-[19px] font-bold text-heading leading-snug [text-wrap:balance]">{next.title}</span>
            </span>
            <span aria-hidden className="shrink-0 text-heading text-[20px] transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
          <div className="mt-6 rounded-[22px] bg-canvas border border-line p-6 sm:p-8">
            <p className="text-[22px] font-bold text-heading leading-tight">Want this sorted for your business?</p>
            <p className="mt-2 text-[16px] leading-[1.6] text-body">Flowrate builds custom apps, dashboards, portals and websites around how you already work. Tell us how your work runs on a free call.</p>
            <PrimaryButton className="mt-5">Book a free call</PrimaryButton>
            <p className="mt-5 text-[14px] text-body">
              Who we build for:{" "}
              {industries.map((ind, i) => (
                <span key={ind.slug}>
                  <Link href={`/for/${ind.slug}`} className="fr-ul font-semibold text-heading">{ind.label.toLowerCase()}</Link>
                  {i < industries.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </div>
        </article>
        <section className="max-w-[1240px] mx-auto px-5 sm:px-8 mt-20">
          <h2 className="text-[22px] font-bold text-heading">More guides</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/blog/${m.slug}`} className="block rounded-[18px] border border-line p-5 hover:border-line-strong transition-colors h-full">
                  <p className="text-[13px] text-muted">{fmtDate(m.date)} · {readMinutes(m)} min read</p>
                  <p className="mt-1 text-[17px] font-bold text-heading leading-snug">{m.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
