import { fetchAllEntries } from "./fetchData";
import { WikiEntry } from "./types";
import { categories, starterData } from "./starterData";

export type FeaturedMethod = {
  id: string;
  title: string;
  description: string;
  href: string;
  tag: string;
};

// === Utility Functions ===

const toWikiSlug = (title: string) => title.trim().replace(/\s+/g, "_");

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Simple random selection without crypto overhead
const pickRandomDistinct = <T>(items: T[], count: number): T[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, items.length));
};

// === Tag Generation ===

/**
 * Generate a random tag for a wiki article based on starterData metadata
 */
const getWikiTag = (wikiTitle: string): string => {
  // Find matching method in starterData
  const starterMatch = starterData.find(
    (m) => toWikiSlug(m.method).toLowerCase() === wikiTitle.toLowerCase()
  );

  if (!starterMatch) return "Method";

  // Collect all true properties as potential tags
  const potentialTags = Object.keys(categories).flatMap((category) => {
    const categoryData = starterMatch[category as keyof typeof starterMatch];
    return Object.entries(categoryData as Record<string, boolean>)
      .filter(([, value]) => value === true)
      .map(([key]) => key);
  });

  if (potentialTags.length === 0) return "Method";

  // Pick random tag and capitalize
  const randomTag = pickRandomDistinct(potentialTags, 1)[0];
  return capitalize(randomTag);
};

// === Main Data Fetching ===

/**
 * Fetches random wiki articles from MediaWiki API.
 * Falls back to starterData if API fails or returns no results.
 */
export async function getRandomFeaturedMethods(
  count: number = 4
): Promise<FeaturedMethod[]> {
  try {
    // Fetch all wiki entries from MediaWiki API
    const allEntries: WikiEntry[] = await fetchAllEntries();

    if (!allEntries || allEntries.length === 0) {
      throw new Error("No wiki entries returned from API");
    }

    // Pick random entries
    const randomEntries = pickRandomDistinct(allEntries, count);

    // Map to FeaturedMethod format
    return randomEntries.map((entry) => ({
      id: toWikiSlug(entry.title),
      title: entry.title,
      description: "Explore this research method in detail.",
      href: `/wiki/${toWikiSlug(entry.title)}`,
      tag: getWikiTag(entry.title),
    }));
  } catch (error) {
    // Fallback to starterData if MediaWiki API fails
    console.error("Error fetching wiki articles, using fallback:", error);

    const fallbackMethods = pickRandomDistinct(starterData, count);

    return fallbackMethods.map((method) => ({
      id: toWikiSlug(method.method),
      title: method.method,
      description: method.description || "Explore this research method.",
      href: `/wiki/${toWikiSlug(method.method)}`,
      tag: getWikiTag(method.method),
    }));
  }
}
