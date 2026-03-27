"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Card, { cardTagStyles } from "@/components/card/card";
import Button from "@/components/buttons/button";
import type { DesignCriteriaFields } from "@/lib/wikiMetadataExtractor";
import styles from "./methodBrowser.module.css";

type TabType = "type" | "reasoning" | "level" | "time" | "normativity";

type TabConfig = {
  id: TabType;
  label: string;
  categories: string[];
};

const TABS: TabConfig[] = [
  {
    id: "type",
    label: "View by Category",
    categories: ["quantitative", "qualitative"],
  },
  {
    id: "reasoning",
    label: "View by Type",
    categories: ["deductive", "inductive"],
  },
  {
    id: "level",
    label: "View by Level",
    categories: ["individual", "system", "global"],
  },
  {
    id: "time",
    label: "View by Time",
    categories: ["past", "present", "future"],
  },
  {
    id: "normativity",
    label: "Normativity",
    categories: [], // Filtered via article.normativity flag, not dimension categories
  },
];

const METHODS_PER_PAGE = 8;
const MAX_HOMEPAGE_METHODS = 24;

export type BrowseMethod = {
  pageid: number;
  title: string;
  description: string | null;
  normativity: boolean;
} & DesignCriteriaFields;

type BrowserProps = {
  methods: BrowseMethod[];
  dataFallback: boolean;
};

/**
 * Client Component - Handles interactive features (tabs, pagination)
 * Receives pre-fetched data from Server Component parent
 */
export default function MethodBrowserClient({
  methods,
  dataFallback,
}: BrowserProps) {
  const [activeTab, setActiveTab] = useState<TabType>("type");
  const [visibleCount, setVisibleCount] = useState(METHODS_PER_PAGE);

  // Get primary tag using TABS.categories as direct keys on BrowseMethod
  const getPrimaryTag = (article: BrowseMethod, tabId: TabType): string => {
    if (tabId === "normativity") return "Normativity";
    const tabConfig = TABS.find((tab) => tab.id === tabId)!;
    const firstTrue = tabConfig.categories.find(
      (cat) => article[cat as keyof BrowseMethod] === true,
    );

    return firstTrue
      ? firstTrue.charAt(0).toUpperCase() + firstTrue.slice(1)
      : "Unspecified";
  };

  // Filter methods based on at least one true flag in the active tab's dimension
  const filteredMethods = useMemo(() => {
    if (activeTab === "normativity") {
      return methods.filter((article) => article.normativity === true);
    }
    const activeTabConfig = TABS.find((tab) => tab.id === activeTab)!;
    // Alternative implementation: const activeTabConfig = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];
    return methods.filter((article) =>
      activeTabConfig.categories.some(
        (cat) => article[cat as keyof BrowseMethod] === true,
      ),
    );
  }, [methods, activeTab]);

  // Get visible methods for current pagination state
  const visibleMethods = useMemo(
    () => filteredMethods.slice(0, visibleCount),
    [filteredMethods, visibleCount],
  );

  // Check if we've reached the maximum homepage display threshold
  const reachedMaxThreshold = visibleCount >= MAX_HOMEPAGE_METHODS;

  // Check if there are more methods beyond our threshold
  const hasMoreMethods = visibleCount < filteredMethods.length;

  // Convert method title to URL-safe format
  const getMethodUrl = (title: string): string => {
    // Replace spaces with underscores to match MediaWiki URL structure
    const urlSafeTitle = title.replace(/ /g, "_");
    return `/wiki/${encodeURIComponent(urlSafeTitle)}`;
  };

  // Handle tab change - reset pagination
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setVisibleCount(METHODS_PER_PAGE);
  };

  // Handle load more - increase visible count
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + METHODS_PER_PAGE);
  };

  // Handle show less - reset to initial count
  const handleShowLess = () => {
    setVisibleCount(METHODS_PER_PAGE);
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Browse Methods</h2>
        <p className={styles.subtitle}>
          Explore research methods by different dimensions
        </p>
        {dataFallback && (
          <div className={styles.fallbackNotice}>
            Showing cached methods (API unavailable)
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <nav
        className={styles.tabNav}
        role="tablist"
        aria-label="Method browsing tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.tabActive : ""
            }`}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Method Grid */}
      <div
        className={styles.methodGrid}
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {visibleMethods.map((entry) => {
          const tag = getPrimaryTag(entry, activeTab);
          const url = getMethodUrl(entry.title);
          const displayTitle = entry.title.replace(/_/g, " ");

          return (
            <Card
              key={entry.pageid}
              href={url}
              interactive
              className={styles.methodCard}
              header={
                <div className={styles.cardHeader}>
                  <span className={cardTagStyles.tag}>{tag}</span>
                </div>
              }
            >
              <h3 className={styles.methodTitle}>{displayTitle}</h3>
              <p className={styles.methodDescription}>
                {entry.description || "Explore this research method"}
              </p>
            </Card>
          );
        })}
      </div>

      {/* No reuslts message */}
      {filteredMethods.length === 0 && (
        <div className={styles.noResults}>
          {" "}
          No methods found for this filter.
        </div>
      )}

      {/* Load More or Navigate to Full List */}
      {hasMoreMethods && (
        <div className={styles.loadMoreContainer}>
          {!reachedMaxThreshold ? (
            // Show "Load More" button until threshold reached
            <Button
              defaultText={`Load More Methods (${
                filteredMethods.length - visibleCount
              } remaining)`}
              loadingText="Loading..."
              type="button"
              variant="default"
              onClick={handleLoadMore}
              className={styles.loadMoreButton}
              ariaLabel="View all methods"
            />
          ) : (
            // Navigate to full wiki page after threshold
            <Link href="/wiki" className={styles.viewAllLink}>
              <Button
                defaultText="View All Methods →"
                loadingText="Loading..."
                type="button"
                variant="primary"
                className={styles.viewAllButton}
                ariaLabel="View All Methods"
              />
            </Link>
          )}
        </div>
      )}
      {/* Method Count Footer */}
      <div className={styles.footer}>
        <p className={styles.countText}>
          Showing {visibleMethods.length} of {filteredMethods.length} methods
          {reachedMaxThreshold && hasMoreMethods && " (homepage preview"}
        </p>
      </div>
    </section>
  );
}
