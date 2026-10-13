import { Carousel21 } from "./Slides";

export default async function Page({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  return <Carousel21 s={s} />;
}
