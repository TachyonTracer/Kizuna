import { HeroLayout } from "@/components/layout";
import { LoaderLayout } from "@/components/loader";

export default function Home() {
  return (
    <LoaderLayout>
      <HeroLayout />
    </LoaderLayout>
  );
}
