// src/app/page.tsx
import Link from "next/link";
import prisma from "@/lib/db";
import styles from "./wikis.module.css";
import Image from "next/image";
import {
  categories,
  ARTICLE_TYPE_OPTIONS,
  type ArticleTypeKey,
} from "@/lib/starterData";
import WikiFilterPanel from "@/components/wikiFilter/wikiFilterPanel";
import { Suspense } from "react";
import type { Prisma } from "@generated/prisma/client";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Flat set of all dimension criteria keys for validation
const CRITERIA_KEYS = new Set(Object.values(categories).flat());

// Maps each article-type URL param → its Prisma WHERE condition.
// To add a new type: add an entry in ARTICLE_TYPE_OPTIONS + one case here.
const TYPE_WHERE: Record<ArticleTypeKey, Prisma.MethodArticleWhereInput> = {
  methods: { articleType: "METHOD" },
  normativity: { normativity: true },
  tools: { wikiCategories: { has: "Hacks, Habits & Tools" } },
  statistics: { wikiCategories: { has: "Statistics" } },
  python: { wikiCategories: { has: "Python" } },
  other: { articleType: "OTHER" },
};

export default async function WikisPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // Dimension criteria (AND semantics — all selected must be true)
  const criteriaFilter = Object.fromEntries(
    [...CRITERIA_KEYS]
      .filter((key) => params[key] === "true")
      .map((key) => [key, true]),
  );

  // Article type filters (OR semantics — show any of the selected types)
  const activeTypeFilters = ARTICLE_TYPE_OPTIONS.filter(
    ({ key }) => params[key] === "true",
  ).map(({ key }) => TYPE_WHERE[key]);

  const where: Prisma.MethodArticleWhereInput = {
    ...criteriaFilter,
    ...(activeTypeFilters.length > 0 ? { OR: activeTypeFilters } : {}),
  };

  const articles = await prisma.methodArticle.findMany({
    where,
    select: { pageid: true, title: true },
    orderBy: { title: "asc" },
  });

  const hasFilters =
    activeTypeFilters.length > 0 || Object.keys(criteriaFilter).length > 0;

  return (
    <div className={styles.container}>
      <h1>Methods Wiki</h1>
      <p className={styles.pageDescription}>
        Browse all synced articles. Use filters below to narrow by article type
        or research method criteria.
      </p>
      {/* Suspense required because WikiFilterPanel uses useSearchParams */}
      <Suspense>
        <WikiFilterPanel />
      </Suspense>
      <p>
        {articles.length} article{articles.length !== 1 ? "s" : ""} found
      </p>
      <div className={styles["card-grid"]}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.pageid}
              href={`/wiki/${encodeURIComponent(
                article.title.replace(/ /g, "_"),
              )}`}
            >
              <div className={styles.card}>
                <Image
                  src="/logo.png"
                  alt={article.title}
                  width={80}
                  height={80}
                />
                <h3>{article.title.replace(/_/g, " ")}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p>
            No articles match the selected filters.{" "}
            <Link href="/wiki">Clear all filters</Link>
          </p>
        )}
      </div>
    </div>
  );
}
