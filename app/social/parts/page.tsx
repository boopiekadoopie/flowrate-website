import { Parts } from "./Parts";

export default async function Page({ searchParams }: { searchParams: Promise<{ part?: string; t?: string; held?: string }> }) {
  const { part, t, held } = await searchParams;
  return <Parts part={part} t={Number(t ?? 0)} held={held === "1"} />;
}
