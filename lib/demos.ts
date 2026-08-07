export type DemoEntry = {
  clientName: string;
  loomId: string;
  demoSiteUrl?: string;
  calendlyUrl?: string;
  note?: string;
};

// Add one entry per prospect. loomId is just the id from the Loom share URL
// (loom.com/share/<id> -> use <id>).
export const demos: Record<string, DemoEntry> = {
  "total-lawn": {
    clientName: "Total Lawn & Sprinkler",
    loomId: "REPLACE_WITH_LOOM_ID",
    demoSiteUrl: "https://total-lawn-sprinkler.vercel.app",
    calendlyUrl: "https://calendly.com/andrewedwardmurray/30min",
  },
};
