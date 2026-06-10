import prisma from "@/lib/db";
import { fetchWikiSiteStats } from "@/lib/fetchData";
import styles from "./trustIndicators.module.css";

type Indicator = {
  value: number;
  label: string;
};

const TrustIndicators = async () => {
  const [
    wikiStats,
    methodsCount,
    toolsCount,
    normativityCount,
    qualitativeCount,
  ] = await Promise.all([
    fetchWikiSiteStats(),
    prisma.methodArticle.count({ where: { articleType: "METHOD" } }),
    prisma.methodArticle.count({
      where: { wikiCategories: { has: "Hacks, Habits & Tools" } },
    }),
    prisma.methodArticle.count({ where: { normativity: true } }),
    prisma.methodArticle.count({ where: { qualitative: true } }),
  ]);

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
