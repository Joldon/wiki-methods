// src/lib/fetchData.ts

import { WikiEntry, WikiContent } from "./types";

export const API_URL = "https://sustainabilitymethods.org/api.php";
// const BASE_URL = "https://sustainabilitymethods.org/";

export const fetchAllEntries = async (): Promise<WikiEntry[]> => {
  try {
    const response = await fetch(
      `${API_URL}?action=query&list=allpages&format=json&aplimit=max`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.query.allpages;
  } catch (error) {
    console.error("Error fetching all entries:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

// PREVIOUS VERSION OF fetchPageContent THAT DOES NOT CATCH FETCHING ERRORS
// export const fetchPageContent = async (title: string): Promise<string> => {
//   const response = await fetch(
//     `${API_URL}?action=parse&page=${title}&format=json`
//   );
//   const data: WikiContent = await response.json();
//   return data.parse.text["*"];
// };

// Internal core - shared by both public exports
// Throws on any failure. No catch block
const fetchPageContentCore = async (title: string): Promise<string> => {
  const BASE_URL = "https://sustainabilitymethods.org/";
  const response = await fetch(
    `${API_URL}?action=parse&page=${encodeURIComponent(title)}&format=json`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} `);
  }
  const data: WikiContent = await response.json();
  if (!data.parse?.text) {
    throw new Error(
      "Unexpected response structure. Check if the wiki page exists.",
    );
  }
  let content = data.parse.text["*"];
  content = content.replace(/src="\/images\//g, `src="${BASE_URL}images/`);
  content = content.replace(
    /srcset="\/images\//g,
    `srcset="${BASE_URL}images/`,
  );
  // Make all internal /index.php links absolute (covers "Edit section" links)
  content = content.replace(
    /href="\/index\.php/g,
    `href="${BASE_URL}index.php`,
  );
  // Open edit-action links in a new browser tab
  content = content.replace(
    /(<a\b[^>]*href="https:\/\/sustainabilitymethods\.org\/index\.php\?[^"]*action=edit[^"]*")/gi,
    '$1 target="_blank" rel="noopener noreferrer"',
  );

  return content;
};

/**
 * UI version — catches all errors and returns a user-friendly fallback string.
 * Use this in Server/Client Components where graceful degradation is appropriate.
 */
export const fetchPageContent = async (title: string): Promise<string> => {
  try {
    return await fetchPageContentCore(title);
  } catch (error) {
    console.error("Error fetching page content:", error);
    return "This page does not exist. Check if the title of this article corresponds to the article's title on the WikiMethods page.";
  }
};

/**
 * Sync version — throws on failure so the sync loop can record the error
 * and avoid writing corrupted metadata to the database.
 * Use this inside wikiSync.ts.
 */
export const fetchPageContentStrict = (title: string): Promise<string> =>
  fetchPageContentCore(title);

/**
 * Fetch MediaWiki categories for a specific page.
 * Returns categories like: [{ ns: 14, title: "Category:Qualitative" }]
 *
 * Note: This is used as a fallback when the bulk fetch (in wikiSync.ts)
 * doesn't return categories for a specific page.
 */
export const fetchPageCategories = async (
  title: string,
): Promise<Array<{ ns: number; title: string }>> => {
  try {
    const response = await fetch(
      `${API_URL}?action=query&titles=${encodeURIComponent(title)}&prop=categories&cllimit=max&format=json`,
      { cache: "no-store" }, // Disable caching to ensure we get the most up-to-date categories, especially during sync
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const pages = data.query?.pages;

    if (!pages) return [];
    // MediaWiki returns pages as { [pageid]: pageData }
    const page = Object.values(pages)[0] as {
      categories?: Array<{ ns: number; title: string }>;
    };
    return page?.categories ?? [];
  } catch (error) {
    console.error(`Error fetching categories for "${title}":`, error);
    return []; // Return empty array on error to allow sync to continue without categories
  }
};

/**
 * Fetch all pages with their latest revision timestamps.
 * Used by the "Latest Articles" feature to find recently updated articles.
 *
 * Uses generator=allpages + prop=revisions for complete coverage
 * (not limited to 30-day recentchanges window).
 */
export const fetchAllPagesWithTimestamps = async (): Promise<
  Array<{
    pageid: number;
    title: string;
    revisions?: Array<{ timestamp: string }>;
  }>
> => {
  const allPages: Array<{
    pageid: number;
    title: string;
    revisions?: Array<{ timestamp: string }>;
  }> = [];

  let continueToken: Record<string, string> | null = null;

  do {
    const params = new URLSearchParams({
      action: "query",
      generator: "allpages",
      gapnamespace: "0", // Only main namespace
      gaplimit: "max",
      // wikiSync.ts uses gaplimit=max (up to 500 per page) for the same query.
      // "max" is the correct value: fewer round-trips, same result.
      prop: "revisions",
      rvprop: "timestamp",
      format: "json",
    });
    if (continueToken) {
      Object.entries(continueToken).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      next: { revalidate: 7200 }, // Cache for 2 hours to reduce load on the API
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.query?.pages) {
      const pages = Object.values(data.query.pages) as Array<{
        pageid: number;
        title: string;
        revisions?: Array<{ timestamp: string }>;
      }>;
      allPages.push(...pages);
    }
    continueToken = data.continue ?? null;
  } while (continueToken);
  return allPages;
};
