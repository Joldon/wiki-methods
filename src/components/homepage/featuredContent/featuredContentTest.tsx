import { getRandomFeaturedMethods } from "@/lib/featuredMethodsTest";
import Card from "../../card/card";
import styles from "./featuredContent.module.css";

type FeaturedItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tag: string;
  tagStyle?: "interactive" | "beginner" | "default";
  gridSpan?: "large" | "wide" | "default";
  variant?: "default" | "featured";
};

// Static featured items configuration
const STATIC_ITEMS: FeaturedItem[] = [
  {
    id: "ethnography-landscape",
    title: "Ethnography Landscape",
    description:
      "Explore the interconnected world of ethnographic research methods.",
    href: "/landscapes/ethnography-landscape",
    tag: "Interactive",
    tagStyle: "interactive",
    gridSpan: "large",
    variant: "featured",
  },
  {
    id: "starter-package",
    title: "Starter Package",
    description:
      "Essential methods for your first sustainability research project.",
    href: "/starter-package",
    tag: "For Beginners",
    tagStyle: "beginner",
    gridSpan: "wide",
  },
];

// Server Component - fetches real wiki articles from MediaWiki API
export default async function FeaturedContent() {
  // Fetch 4 random wiki articles from MediaWiki (or fallback to starterData)
  const dynamicMethods = await getRandomFeaturedMethods(4);

  return (
    <section className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Curated Collections</span>
          <h2 className={styles.title}>Featured Content</h2>
        </div>

        <div className={styles.bentoGrid}>
          {/* Static featured items */}
          {STATIC_ITEMS.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}

          {/* Dynamic wiki articles from MediaWiki API */}
          {dynamicMethods.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Unified card component
function FeaturedCard({ item }: { item: FeaturedItem }) {
  const gridClass =
    item.gridSpan === "large"
      ? styles.spanLarge
      : item.gridSpan === "wide"
        ? styles.spanWide
        : "";

  const tagClass =
    item.tagStyle === "interactive"
      ? styles.tagInteractive
      : item.tagStyle === "beginner"
        ? styles.tagBeginner
        : "";

  return (
    <Card
      variant={item.variant || "default"}
      className={gridClass}
      href={item.href}
      interactive
      header={<span className={`${styles.tag} ${tagClass}`}>{item.tag}</span>}
    >
      <div className={styles.cardContent}>
        <h3
          className={
            item.gridSpan === "large" ? styles.cardTitleLarge : styles.cardTitle
          }
        >
          {item.title}
        </h3>
        <p className={styles.cardDescription}>{item.description}</p>
      </div>
    </Card>
  );
}
