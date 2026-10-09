export type DemoEntry = {
  clientName: string;
  loomId: string;
  demoSiteUrl?: string;
  calendlyUrl?: string;
  note?: string;
};

// Add one entry per prospect. loomId is just the id from the Loom share URL
// (loom.com/share/<id> -> use <id>).
// Only slugs listed here render; anything else is a 404, so nobody can build a branded page from
// URL parameters. calendlyUrl falls back to the site-wide booking link.
export const demos: Record<string, DemoEntry> = {};
