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
    clientName: "Total Lawn & Sprinkler Inc",
    loomId: "20c881249cca427ab11deb9706456f72",
    demoSiteUrl: "https://total-lawn-sprinkler.vercel.app",
    calendlyUrl: "https://calendly.com/andrewedwardmurray/30min",
  },
};
