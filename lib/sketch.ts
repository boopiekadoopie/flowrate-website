/*
 * Shared by /api/sketch and the Sketch my app page: the shape of a sketch and each kind of business's own
 * app colours (header + accent), so the drawn app looks like that business's app, not ours. Green stays ours.
 */

export const PALETTES = ["workshop", "trades", "transport", "farm", "salon", "food", "print", "clinic", "retail", "office"] as const;
export type Palette = (typeof PALETTES)[number];
export const KINDS = ["text", "number", "money", "photo", "signature", "choice", "check", "date"] as const;
export type FieldKind = (typeof KINDS)[number];

export type SketchField = { label: string; kind: FieldKind; value: string; options: string[] };
export type SketchResult = {
  name: string;
  business: string;
  palette: Palette;
  phone: { who: string; title: string; fields: SketchField[]; button: string };
  office: { title: string; columns: string[]; statuses: string[]; rows: string[][] };
  customer: { message: string } | null;
  numbers: { label: string; value: string }[];
  fix: string;
  first: string[];
};

/* header: the app bar; accent: the second word of the name and the main button. */
export const PALETTE_COLORS: Record<Palette, { header: string; accent: string }> = {
  workshop: { header: "#1E1E24", accent: "#FFC93C" },
  trades: { header: "#1D3557", accent: "#F4A261" },
  transport: { header: "#0F2A44", accent: "#5BC0EB" },
  farm: { header: "#1F3A2B", accent: "#B5E48C" },
  salon: { header: "#3A1F2E", accent: "#F2A7C3" },
  food: { header: "#3B2416", accent: "#F6BD60" },
  print: { header: "#7A1747", accent: "#7FD3F5" },
  clinic: { header: "#0B4F6C", accent: "#7FD1AE" },
  retail: { header: "#2B2D42", accent: "#EF8354" },
  office: { header: "#0E4D5C", accent: "#F2B33D" },
};
