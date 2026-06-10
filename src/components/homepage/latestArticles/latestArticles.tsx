import { fetchLatestArticles } from "@/lib/fetchData";
import { LatestArticle } from "@/lib/types";
import styles from "./latestArticles.module.css";
import LatestArticlesCarousel from "./latestArticlesCarousel";

const LatestArticles = async () => {
  const articles: LatestArticle[] = await fetchLatestArticles(12);
  // graceful no-op if API fails
  if (articles.length === 0) return null;
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Recently Published</span>
          <h2 className={styles.title}>Latest Articles</h2>
        </div>
        <LatestArticlesCarousel articles={articles} />
      </div>
    </section>
  );
};

export default LatestArticles;
