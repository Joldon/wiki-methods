import prisma from "@/lib/db";
import { fetchWikiSiteStats } from "@/lib/fetchData";
import styles from "./trustIndicators.module.css";

type Indicator = {
  value: number;
  label: string;
};

const getTrustIndicatorCounts = async (): Promise<
  [number, number, number, number]
> =>
  Promise.all([
    prisma.methodArticle.count({ where: { articleType: "METHOD" } }),
    prisma.methodArticle.count({
      where: { wikiCategories: { has: "Hacks, Habits & Tools" } },
    }),
    prisma.methodArticle.count({ where: { normativity: true } }),
    prisma.methodArticle.count({ where: { qualitative: true } }),
  ]);

const TrustIndicators = async () => {
  // const [
  //   wikiStats,
  //   methodsCount,
  //   toolsCount,
  //   normativityCount,
  //   qualitativeCount,
  // ] = await Promise.all([
  //   fetchWikiSiteStats(),
  //   prisma.methodArticle.count({ where: { articleType: "METHOD" } }),
  //   prisma.methodArticle.count({
  //     where: { wikiCategories: { has: "Hacks, Habits & Tools" } },
  //   }),
  //   prisma.methodArticle.count({ where: { normativity: true } }),
  //   prisma.methodArticle.count({ where: { qualitative: true } }),
  // ]);

  const wikiStats = await fetchWikiSiteStats();
  let methodsCount = 0;
  let toolsCount = 0;
  let normativityCount = 0;
  let qualitativeCount = 0;

  try {
    [methodsCount, toolsCount, normativityCount, qualitativeCount] =
      await getTrustIndicatorCounts();
  } catch (error) {
    const isConnectionTermination =
      error instanceof Error &&
      error.message.toLowerCase().includes("connection terminated");

    if (isConnectionTermination) {
      try {
        [methodsCount, toolsCount, normativityCount, qualitativeCount] =
          await getTrustIndicatorCounts();
      } catch (retryError) {
        console.warn(
          "Failed to fetch trust indicators from database after retry",
          retryError,
        );
      }
    } else {
      console.warn("Failed to fetch trust indicators from database", error);
    }
  }

  const indicators: Indicator[] = [
    { value: wikiStats.articles, label: "Total Articles" },
    { value: wikiStats.users, label: "Community Members" },
    { value: wikiStats.edits, label: "Total Edits" },
    { value: wikiStats.activeusers, label: "Active Contributors" },
    { value: methodsCount, label: "Research Methods" },
    { value: toolsCount, label: "Hacks & Tools" },
    { value: normativityCount, label: "Normativity Articles" },
    { value: qualitativeCount, label: "Qualitative Methods" },
  ];
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Trust Indicators</span>
          <h2 className={styles.sectionTitle}>Community & Content Stats</h2>
        </div>

        <div className={styles.grid}>
          {indicators.map((indicator) => (
            <div key={indicator.label} className={styles.stat}>
              <div className={styles.number}>
                {indicator.value.toLocaleString("en-US")}
              </div>
              <div className={styles.label}>{indicator.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
