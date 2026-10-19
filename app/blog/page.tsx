import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui";
import { posts, fmtDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Guides | Flowrate",
  description: "Plain-English guides on getting the retyping, chasing and manual admin out of how a business runs.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Guides | Flowrate", url: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-canvas min-h-dvh pt-32 md:pt-40 pb-24">
        <Container>
          <h1 className="font-display uppercase text-heading text-[42px] sm:text-[58px] leading-[0.96] tracking-[-0.03em]">Guides</h1>
          <p className="mt-5 text-[18px] sm:text-[20px] leading-[1.5] text-body max-w-[620px]">Plain-English guides on getting the retyping, chasing and manual admin out of how a business runs.</p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block h-full rounded-[22px] bg-paper border border-line overflow-hidden hover:border-line-strong transition-colors">
                  <div className="relative aspect-[4/5] bg-soft overflow-hidden">
                    <Image src={p.cover} alt={p.coverAlt} fill loading={i < 3 ? "eager" : "lazy"} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  </div>
                  <div className="p-5">
                    <p className="text-[13px] text-muted">{fmtDate(p.date)}</p>
                    <h2 className="mt-1.5 text-[19px] leading-[1.3] font-bold text-heading [text-wrap:balance]">{p.title}</h2>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}
