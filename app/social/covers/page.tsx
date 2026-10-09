import { Covers } from "./Covers";

export default async function Page({ searchParams }: { searchParams: Promise<{ c?: string; guides?: string; theme?: string }> }) {
  const { c, guides, theme } = await searchParams;
  return <Covers c={c} guides={guides === "1"} theme={theme} />;
}
