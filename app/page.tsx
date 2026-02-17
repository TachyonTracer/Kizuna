import HeroLayout from "./(layout)/Hero/layout";
import LoaderLayout from "./(components)/(loader)/layout";

export default function Home() {
  return (
    <LoaderLayout>
      <HeroLayout />
    </LoaderLayout>
  );
}
