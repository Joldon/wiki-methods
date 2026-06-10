import { getRandomFeaturedMethods } from "@/lib/featuredMethods";
import Card, { cardTagStyles } from "@/components/card/card";
import styles from "./featuredContent.module.css";

type FeaturedItem = {
  id: string;
  title: string;
  description?: string;
  href: string;
  tag: string;
  tagStyle?: "default" | "interactive" | "beginner";
  gridSpan?: "large" | "wide" | "default";
  variant?: "default" | "featured";
};

// Static items configuration
const STATIC_ITEMS = [
  {
    id: "ethnography-landscape",
    title: "Ethnography Landscape",
    description:
      "Explore the interconnected world of ethnographic methods through our interactive force-directed graph visualization.",
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
] as const;

const FeaturedContent = () => {
  // Get 4 random methods dynamically
  const randomMethods = getRandomFeaturedMethods(4);
  return (
    <section className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Curated Collections</span>
          <h2 className={styles.title}>Featured Content</h2>
        </div>

        <div className={styles.bentoGrid}>
          {STATIC_ITEMS.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
          {/* Render Dynamic Random Methods */}
          {randomMethods.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Unified Card Component
const FeaturedCard = ({ item }: { item: FeaturedItem }) => {
  // Determine grid class based on span config
  const gridClass =
    item.gridSpan === "large"
      ? styles.spanLarge
      : item.gridSpan === "wide"
        ? styles.spanWide
        : "";

  // determine tag class using centralized card tag styles
  const tagClass =
    item.tagStyle === "interactive"
      ? `${cardTagStyles.tag} ${cardTagStyles.tagSecondary}`
      : item.tagStyle === "beginner"
        ? `${cardTagStyles.tag} ${cardTagStyles.tagAccent}`
        : cardTagStyles.tag;

  return (
    <Card
      variant={item.variant || "default"}
      className={gridClass}
      href={item.href}
      interactive
      header={<span className={tagClass}>{item.tag}</span>}
    >
      <div className={styles.cardContent}>
        <h3
          className={
            item.gridSpan === "large" ? styles.cardTitleLarge : styles.cardTitle
          }
        >
          {item.title}
        </h3>
        {item.description && (
          <p className={styles.cardDescription}>{item.description}</p>
        )}
      </div>
    </Card>
  );
};

export default FeaturedContent;
