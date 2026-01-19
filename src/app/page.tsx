import FeaturedContent from "@/components/homepage/featuredContent";
import Hero from "@/components/homepage/hero";
import ValueProposition from "@/components/homepage/valueProposition";
import FeaturedContentTest from "@/components/homepage/featuredContentTest";
import MethodBrowser from "@/components/homepage/methodBrowser";

export default async function HomePage() {
  return (
    <main>
      <Hero />
      <ValueProposition />
      <FeaturedContent />
      {/* <FeaturedContentTest /> */}
      <MethodBrowser />
    </main>
  );
}
