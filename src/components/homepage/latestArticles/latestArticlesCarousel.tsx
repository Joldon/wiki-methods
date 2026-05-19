"use client";

import { LatestArticle } from "@/lib/types";
import { useRef } from "react";
import styles from "./latestArticles.module.css";
import Card from "@/components/card/card";

type Props = {
  articles: LatestArticle[];
};

const LatestArticlesCarousel = ({ articles }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: direction === "right" ? 280 : -280,
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.carouselWrapper}>
      <button
        className={styles.scrollBtn}
        onClick={() => scroll("left")}
        aria-label="Scroll left"
      >
        ←
      </button>

      <div ref={trackRef} className={styles.track}>
        {articles.map((article) => (
          <Card
            key={article.logid}
            href={`/wiki/${encodeURIComponent(article.title)}`}
            interactive
            className={styles.articleCard}
          >
            <span className={styles.newBadge}>New</span>
            <h4 className={styles.cardTitle}>
              {article.title.replace(/_/g, " ")}
            </h4>
            <time
              className={styles.cardDate}
              dateTime={article.timestamp}
              suppressHydrationWarning
            >
              {new Date(article.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </Card>
        ))}
      </div>
      <button
        className={styles.scrollBtn}
        onClick={() => scroll("right")}
        aria-label="Scroll right"
      >
        →
      </button>
    </div>
  );
};

export default LatestArticlesCarousel;
