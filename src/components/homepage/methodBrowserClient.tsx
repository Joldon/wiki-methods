"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Card from "@/components/card/card";
import Button from "@/components/buttons/button";
import type { WikiEntry } from "@/lib/types";
import { starterData, type MethodType } from "@/lib/starterData";
import styles from "./methodBrowser.module.css";

type TabType = "type" | "reasoning" | "level" | "time";

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
];

const METHODS_PER_PAGE = 8;
const MAX_HOMEPAGE_METHODS = 24;

type Props = {
  methods: WikiEntry[];
  dataFallback: boolean;
};

/**
 * Client Component - Handles interactive features (tabs, pagination)
 * Receives pre-fetched data from Server Component parent
 */
export default function MethodBrowserClient({ methods, dataFallback }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("type");
  const [visibleCount, setVisibleCount] = useState(METHODS_PER_PAGE);

  // Enrich wiki entries with metadata from starterData for filtering
  // This is client-side only for UI filtering purposes
  const enrichedMethods = useMemo(
    () =>
      methods
        .map((wikiEntry) => {
          // Find matching method in starterData for metadata
          const metadata = starterData.find(
            (method) =>
              method.method === wikiEntry.title ||
              method.method === wikiEntry.title.replace(/_/g, " ")
          );

          return {
            ...wikiEntry,
            metadata: metadata || null,
          };
        })
        // Only include methods that have metadata (exist in starterData)
        .filter((entry) => entry.metadata !== null),
    [methods]
  );

  // Get primary tag for a method based on active tab
  const getPrimaryTag = useMemo(
    () =>
      (metadata: MethodType, dimension: TabType): string => {
        const dimensionData = metadata[dimension];
        const trueKeys = Object.entries(dimensionData)
          .filter(([, value]) => value)
          .map(([key]) => key);

        return trueKeys[0]
          ? trueKeys[0].charAt(0).toUpperCase() + trueKeys[0].slice(1)
          : "Unspecified";
      },
    []
  );

  // Filter methods based on active tab dimension
  const filteredMethods = useMemo(
    () =>
      enrichedMethods.filter((entry) => {
        if (!entry.metadata) return false;

        const dimensionData = entry.metadata[activeTab];
        return Object.values(dimensionData).some((value) => value);
      }),
    [enrichedMethods, activeTab]
  );

  // Get visible methods for current pagination state
  const visibleMethods = useMemo(
    () => filteredMethods.slice(0, visibleCount),
    [filteredMethods, visibleCount]
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
          if (!entry.metadata) return null;

          const tag = getPrimaryTag(entry.metadata, activeTab);
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
                  <span className={styles.tag}>{tag}</span>
                </div>
              }
            >
              <h3 className={styles.methodTitle}>{displayTitle}</h3>
              <p className={styles.methodDescription}>
                {entry.metadata.description || "Explore this research method"}
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
