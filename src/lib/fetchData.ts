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

// new version of fetchPageContent that checks for data.parse and data.parse.text before accessing data.parse.text["*"]
// This prevents the code from breaking if the expected properties are not present
// For example, if the original Wiki article is called "Experiments" but in starterData.ts it is called "Experiment"
// then the API will return an error message instead of the expected data structure
// if the page does not exist, the API will return an error message instead of the expected data structure

export const fetchPageContent = async (title: string): Promise<string> => {
  const BASE_URL = "https://sustainabilitymethods.org/"; // Define the base URL for the wiki to avoid any type errors
  try {
    const response = await fetch(
      `${API_URL}?action=parse&page=${title}&format=json`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: WikiContent = await response.json();
    if (data.parse && data.parse.text) {
      // Check if the expected properties are present
      let content = data.parse.text["*"];

      // Adjust relative URLs to be fully qualified URLs
      content = content.replace(/src="\/images\//g, `src="${BASE_URL}images/`); // Replace src="/images/ with src="https://sustainabilitymethods.org/images/
      content = content.replace(
        /srcset="\/images\//g,
        `srcset="${BASE_URL}images/`, // Replace srcset="/images/ with srcset="https://sustainabilitymethods.org/images/
      );

      return content;
    } else {
      throw new Error(
        "Unexpected response structure. Check if the wiki page exists.",
      );
    }
  } catch (error) {
    console.error("Error fetching page content:", error);
    // throw error; // Re-throw the error to be caught by the calling function
    return "This page does not exist. Check if the title of this article corresponds to the article's title on the WikiMethods page."; // Return a default message in user friendly interface
  }
};

// EXPLANATION
// The fetchPageContent function fetches the content of a wiki page using the MediaWiki API.
// 1. Check for data.parse and data.parse.text: Before accessing data.parse.text["*"], the code checks if data.parse and data.parse.text are defined.
// 2. Error Handling: If data.parse or data.parse.text is not defined, an error is thrown with the message "Unexpected response structure".
// 3. Adjust Relative URLs: The code adjusts relative URLs to be fully qualified URLs, ensuring that images and other resources are correctly linked.
// This modification ensures that the code handles cases where the response structure is not as expected, preventing runtime errors.

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
