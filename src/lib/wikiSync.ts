import type { MethodArticle, Prisma } from "@generated/prisma/browser";
import prisma from "./db";
import { fetchPageContentStrict } from "./fetchData";
import {
  extractArticleMetadata,
  EXCLUDED_PAGES,
  type DesignCriteriaFields,
  type ExtractedMetadata,
} from "./wikiMetadataExtractor";
import { API_URL } from "./fetchData";

// Constants
const FETCH_DELAY_MS = 200; // rate-limit: ms between page fetches

// Types
// derive it from the existing Prisma-backed type aliases so that any
// schema change propagates automatically.
export type MethodFilters = Partial<
  DesignCriteriaFields & Pick<MethodArticle, "normativity">
>;

// Internal shape returned by the MediaWiki generator=allpages + prop=revisions call.
type WikiPageMeta = {
  pageid: number;
  ns: number;
  title: string;
  revisions?: Array<{ timestamp: string }>;
};

// Internal fetchers
/**
 * Fetches all wiki pages with their latest revision timestamp.
 * Uses cursor-based pagination (gapcontinue) to handle large wikis.
 */

const fetchAllPagesWithMeta = async (): Promise<WikiPageMeta[]> => {
  const pages: WikiPageMeta[] = [];
  let continueToken: string | undefined;

  do {
    const continueParam = continueToken
      ? `&gapcontinue=${encodeURIComponent(continueToken)}`
      : "";
    const url =
      `${API_URL}?action=query&generator=allpages&prop=revisions` +
      `&rvprop=timestamp&gaplimit=max&format=json${continueParam}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`MediaWiki API error: ${res.status}`);
    const data = await res.json();

    pages.push(
      ...Object.values(
        (data.query?.pages ?? {}) as Record<string, WikiPageMeta>,
      ),
    );
    continueToken = (data.continue as { gapcontinue?: string } | undefined)
      ?.gapcontinue;
  } while (continueToken);
  return pages;
};

/**
 * Fetches MediaWiki categories for a single page.
 * Returns the array shape expected by extractFromWikiCategories.
 * This function's only job: ask MediaWiki "what categories does this one page belong to?"
 * and return the answer as a clean array.
 */
const fetchPageCategories = async (
  title: string,
): Promise<Array<{ ns: number; title: string }>> => {
  const url =
    `${API_URL}?action=query&titles=${encodeURIComponent(title)}` +
    `&prop=categories&cllimit=max&format=json`;
  const res = await fetch(url, { cache: "no-store" }); // Disable caching to ensure we get the most up-to-date categories, especially during sync
  if (!res.ok) throw new Error(`MediaWiki API error: ${res.status}`);
  const data = await res.json();

  const pages = Object.values(
    (data.query?.pages ?? {}) as Record<
      string,
      { categories?: Array<{ ns: number; title: string }> }
    >,
  );
  return pages[0].categories ?? [];
};

// Helpers
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// syncWiki
/**
 * Syncs all method articles from the MediaWiki API into the database.
 * Skips excluded meta-pages and pages whose revision timestamp has not changed.
 */

export const syncWiki = async (): Promise<{
  synced: number;
  skipped: number;
  errors: string[];
}> => {
  const allPages = await fetchAllPagesWithMeta();

  // restrict to main namespace (ns=0), skip meta-pages defined in wikiMetadataExtractor.ts
  const pagesToProcess = allPages.filter(
    (p) => p.ns === 0 && !EXCLUDED_PAGES.has(p.title),
  );
  // Load existing revision timestamps for incremental sync
  const existingArticles = await prisma.methodArticle.findMany({
    select: { pageid: true, wikiRevisionTimestamp: true },
  });
  const existingByPageId = new Map(
    existingArticles.map((a) => [a.pageid, a.wikiRevisionTimestamp]),
  );

  // Skip pages whose revision timestamp matches what is already stored.
  const pagesToSync = pagesToProcess.filter((page) => {
    const latestTimestamp = page.revisions?.[0]?.timestamp ?? null;
    const storedTimestamp = existingByPageId.get(page.pageid);
    return (
      !storedTimestamp ||
      !latestTimestamp ||
      new Date(latestTimestamp).getTime() !== storedTimestamp.getTime()
    );
  });
  const skipped = pagesToProcess.length - pagesToSync.length;

  //  async reduce accumulates results functionally; sequential processing is
  // preserved (each iteration awaits the previous one through accPromise).
  const { synced, errors } = await pagesToSync.reduce<
    Promise<{ synced: number; errors: string[] }>
  >(
    async (accPromise, page) => {
      const acc = await accPromise; // wait for previous iteration to complete
      try {
        // Fetch content and categories concurrently for the same page.
        // fetchPageContentStrict throws on failure so this page is counted
        // as an error rather than silently upserting placeholder metadata.

        const [html, categories] = await Promise.all([
          fetchPageContentStrict(page.title),
          fetchPageCategories(page.title),
        ]);

        const metadata: ExtractedMetadata = extractArticleMetadata(
          html,
          categories,
        );
        const revisionTimestamp = page.revisions?.[0]?.timestamp
          ? new Date(page.revisions[0].timestamp)
          : null;
        await prisma.methodArticle.upsert({
          where: { pageid: page.pageid },
          update: {
            title: page.title,
            ...metadata, // description, articleType, normativity, wikiCategories, + 10 criteria
            wikiRevisionTimestamp: revisionTimestamp,
            lastSyncedAt: new Date(),
          },
          create: {
            pageid: page.pageid,
            title: page.title,
            ...metadata,
            wikiRevisionTimestamp: revisionTimestamp,
            lastSyncedAt: new Date(),
          },
        });
        await delay(FETCH_DELAY_MS); // rate-limit to avoid overwhelming the API
        return { ...acc, synced: acc.synced + 1 };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          ...acc,
          errors: [...acc.errors, `[${page.title}] ${message}`],
        };
      }
    },
    Promise.resolve({ synced: 0, errors: [] }), // initial accumulator value
  );
  return { synced, skipped, errors };
};

// getFilteredMethods
/**
 * Returns method articles matching the given filter criteria (AND semantics).
 */
export const getFilteredMethods = async (filters: MethodFilters) => {
  // use the generated Prisma.MethodArticleWhereInput.
  const criteriaWhere = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v === true),
  ) as Prisma.MethodArticleWhereInput;

  // If normativity is not explicitly requested, restrict to METHOD articles only.
  const where: Prisma.MethodArticleWhereInput = {
    ...criteriaWhere,
    ...(!filters.normativity && { articleType: "METHOD" }),
  };

  return prisma.methodArticle.findMany({ where });
};
