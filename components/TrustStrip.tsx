const signals = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
    text: "2-week build — live fast",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    text: "Free homepage mockup — no commitment",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    text: "100% satisfaction guarantee",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.315-.6a32.878 32.878 0 002.333-1.812 1.25 1.25 0 11.39 2.343 29.52 29.52 0 00-2.029 1.574V17.25a.75.75 0 01-.975.714L2.25 16.5a.75.75 0 01-.5-.707V9.25c0-.418.34-.75.75-.75h2a.75.75 0 010 1.5H3v4.906l3.75 1.125V11.25a.75.75 0 011.5 0v6.036l1.5.45V9.25a.75.75 0 01.5-.708 29.42 29.42 0 004.014-1.917 1.25 1.25 0 110 2.165 31.4 31.4 0 01-4.014 1.855v5.65l2.25-.675V11.25a.75.75 0 011.5 0V16.5l3.75-1.125V10h-1.5a.75.75 0 010-1.5h2a.75.75 0 01.75.75v7.543a.75.75 0 01-.5.707l-5.25 1.575a.75.75 0 01-.434 0L10 18.357l-4.316 1.294A.75.75 0 015 19.25V9.25a.75.75 0 01.5-.708A29.4 29.4 0 009.5 6.634V4.956a29.4 29.4 0 00-4.014 1.917 1.25 1.25 0 110-2.165A31.385 31.385 0 019.664 1.319z" clipRule="evenodd" />
      </svg>
    ),
    text: "Irrigation specialists only",
  },
];

export function TrustStrip() {
  return (
    <div className="bg-[#0C1A0D] border-y border-[#99E58C]/10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {signals.map((s) => (
            <div key={s.text} className="flex items-center gap-2.5 text-white/60">
              <span className="text-green flex-shrink-0">{s.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
