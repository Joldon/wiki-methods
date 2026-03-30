// src/app/page.tsx
import Link from "next/link";
import prisma from "@/lib/db";
import styles from "./wikis.module.css";
import Image from "next/image";
import { categories } from "@/lib/starterData";
import WikiFilterPanel from "@/components/wikiFilter/wikiFilterPanel";
import { Suspense } from "react";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Single source of truth: criteria keys derived from starterData.categories
const CRITERIA_KEYS = new Set(Object.values(categories).flat());

export default async function WikisPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // Build dimension filter (AND semantics — all selected criteria must match)
  const criteriaFilter = Object.fromEntries(
    [...CRITERIA_KEYS]
      .filter((key) => params[key] === "true")
      .map((key) => [key, true]),
  );

  const showNormativity = params.normativity === "true";

  const articles = await prisma.methodArticle.findMany({
    where: {
      ...criteriaFilter,
      ...(showNormativity
        ? { OR: [{ articleType: "METHOD" }, { articleType: "NORMATIVITY" }] }
        : { articleType: "METHOD" }),
    },
    select: { pageid: true, title: true },
    orderBy: { title: "asc" },
  });
  return (
    <div className={styles.container}>
      <h1>Wiki Pages</h1>
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
          <p>No wiki entries found for the selected filters.</p>
        )}
      </div>
    </div>
  );
}
