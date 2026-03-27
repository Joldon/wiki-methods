"use client";
import { categories } from "@/lib/starterData";
import styles from "./wikiFilterPanel.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { curveNatural } from "d3";

const WikiFilterPanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const toggle = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === "true") {
      params.delete(key);
    } else {
      params.set(key, "true");
    }
    startTransition(() => {
      router.push(`/wiki?${params.toString()}`);
    });
  };

  const clearAll = () => startTransition(() => router.push("/wiki"));

  const hasActiveFilters = searchParams.size > 0;
  return (
    <div className={styles.panel} aria-label="Filter articles">
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

      {/* Normativity is an article-type toggle, not a dimension criterion */}
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>Article Type</h4>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={searchParams.get("normativity") === "true"}
            onChange={() => toggle("normativity")}
            disabled={isPending}
          />
          Include Normativity
        </label>
      </div>
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className={styles.clearButton}
          disabled={isPending}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default WikiFilterPanel;
