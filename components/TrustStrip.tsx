const items = [
  "2-week build time",
  "Free homepage mockup",
  "100% satisfaction guarantee",
  "Irrigation specialists only",
  "Mobile-first design",
  "SEO-optimized from day one",
  "Cancel retainer anytime",
  "No templates, custom built",
];

export function TrustStrip() {
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#0A170A] border-y border-green/10 py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-white/50 text-sm font-medium px-8 flex-shrink-0"
          >
            <span className="w-1 h-1 rounded-full bg-green/60 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
