import FeaturedContent from "@/components/homepage/featuredContent/featuredContent";
import Hero from "@/components/homepage/hero/hero";
import ValueProposition from "@/components/homepage/valueProposition/valueProposition";
import LatestArticles from "@/components/homepage/latestArticles/latestArticles";
import FeaturedContentTest from "@/components/homepage/featuredContent/featuredContentTest";
import MethodBrowser from "@/components/homepage/methodBrowser/methodBrowser";

export default async function HomePage() {
  return (
    <main>
      <Hero />
      <ValueProposition />
      <FeaturedContent />
      <LatestArticles />
      {/* <FeaturedContentTest /> */}
      <MethodBrowser />
    </main>
  );
}
