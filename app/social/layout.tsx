import type { Metadata } from "next";

/* Social slides are rendered from the site's own components so carousels and site stay identical.
   Never indexed, never linked. */
export const metadata: Metadata = {
  title: "Flowrate slides",
  robots: { index: false, follow: false },
};

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#E9E9E9] min-h-screen">
      <style>{`nextjs-portal{display:none!important}`}</style>
      {children}
    </div>
  );
}
