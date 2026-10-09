import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demos } from "@/lib/demos";
import { FlowrateWordmark } from "@/components/FlowrateLogo";
import { CALENDLY_URL } from "@/lib/site";

function resolveDemo(slug: string) {
  const preset = Object.hasOwn(demos, slug) ? demos[slug] : undefined;
  return preset ? { ...preset, calendlyUrl: preset.calendlyUrl ?? CALENDLY_URL } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const demo = resolveDemo(slug);
  if (!demo) return { robots: { index: false, follow: false } };

  const title = `${demo.clientName} — a quick look from Flowrate`;
  const description = `A short walkthrough Andrew put together for ${demo.clientName}.`;
  const imageUrl = "/og-home-v2.jpg";

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: `/demo/${slug}` },
    openGraph: {
      title,
      description,
      url: `/demo/${slug}`,
      siteName: "Flowrate Agency",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Flowrate" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = resolveDemo(slug);
  if (!demo) notFound();

  return (
    <main className="min-h-screen bg-[color:var(--color-deep)] text-white">
      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <FlowrateWordmark className="mb-10" />

        <h1 className="font-display text-2xl sm:text-3xl leading-tight mb-3">
          {demo.clientName}, here&apos;s the quick walkthrough
        </h1>
        <p className="text-[color:var(--color-silver)] mb-8">
          No sign-up, no pitch deck. Just press play.
        </p>

        <div className="relative w-full overflow-hidden rounded-2xl border border-[color:var(--color-deep-border)] bg-[color:var(--color-deep-card)] shadow-2xl">
          <div className="relative pb-[62.5%]">
            <iframe
              src={`https://www.loom.com/embed/${demo.loomId}?hide_owner=true&hide_share=true&hide_title=true`}
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              title={`Walkthrough for ${demo.clientName}`}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {demo.demoSiteUrl && (
            <a
              href={demo.demoSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[color:var(--color-green)] px-6 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-green-light)]"
            >
              View the live demo site
            </a>
          )}
          {demo.calendlyUrl && (
            <a
              href={demo.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[color:var(--color-deep-border)] px-6 py-3 text-sm font-semibold text-white transition hover:border-[color:var(--color-green)]"
            >
              Book a free call
            </a>
          )}
        </div>

        {"note" in demo && demo.note && (
          <p className="mt-8 text-sm text-[color:var(--color-silver)]">{demo.note}</p>
        )}
      </div>
    </main>
  );
}
