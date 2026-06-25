import FeaturedContent from "@/components/homepage/featuredContent/featuredContent";
import Hero from "@/components/homepage/hero/hero";
import ValueProposition from "@/components/homepage/valueProposition/valueProposition";
import LatestArticles from "@/components/homepage/latestArticles/latestArticles";
import FeaturedContentTest from "@/components/homepage/featuredContent/featuredContentTest";
import MethodBrowser from "@/components/homepage/methodBrowser/methodBrowser";
import TrustIndicators from "@/components/homepage/trustIndicators/trustIndicators";
import MethodGraphSection from "@/components/homepage/methodGraphSection/methodGraphSection";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <FeaturedContent />
      <LatestArticles />
      {/* <FeaturedContentTest /> */}
      {/* <MethodGraphSection /> */}
      <MethodBrowser />
      <TrustIndicators />
    </>
  );
}
