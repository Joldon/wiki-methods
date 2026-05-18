"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { categories } from "@/lib/starterData";
import { ARTICLE_TYPE_OPTIONS } from "@/lib/articleTypeFilters";
import styles from "./wikiFilterPanel.module.css";

export default function WikiFilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (params: URLSearchParams) =>
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/wiki?${qs}` : "/wiki");
    });

  const toggle = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.get(key) === "true" ? params.delete(key) : params.set(key, "true");
    navigate(params);
  };

  const clearAll = () => navigate(new URLSearchParams());

  const clearArticleTypes = () => {
    const params = new URLSearchParams(searchParams.toString());
    ARTICLE_TYPE_OPTIONS.map(({ key }) => key).forEach((key) => {
      params.delete(key);
    });
    navigate(params);
  };

  const hasActiveTypes = ARTICLE_TYPE_OPTIONS.some(
    ({ key }) => searchParams.get(key) === "true",
  );

  const hasActiveFilters = searchParams.size > 0;
  return (
    <div className={styles.panel} aria-label="Filter articles">
      {/* Article type — multi-select pills (OR semantics) */}
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>Article Type</h4>
        <div className={styles.pillRow}>
          <button
            onClick={hasActiveTypes ? clearArticleTypes : undefined}
            className={`${styles.pill} ${!hasActiveTypes ? styles.pillActive : ""}`}
            disabled={isPending || !hasActiveTypes}
            type="button"
          >
            All Articles
          </button>
          {ARTICLE_TYPE_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`${styles.pill} ${searchParams.get(key) === "true" ? styles.pillActive : ""}`}
              disabled={isPending}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Dimension criteria — multi-select checkboxes (AND semantics) */}
      {Object.entries(categories).map(([dimension, options]) => (
        <div key={dimension} className={styles.group}>
          <h4 className={styles.groupTitle}>
            {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
          </h4>
          <div className={styles.options}>
            {options.map((option) => (
              <label key={option} className={styles.label}>
                <input
                  type="checkbox"
                  checked={searchParams.get(option) === "true"}
                  onChange={() => toggle(option)}
                  disabled={isPending}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>
      ))}

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className={styles.clearButton}
          disabled={isPending}
          type="button"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
