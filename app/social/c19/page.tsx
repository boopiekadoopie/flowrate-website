import { Carousel19 } from "./Slides";

export default async function Page({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  return <Carousel19 s={s} />;
}
