import type {
  ArticleType,
  MethodArticle,
} from "../../prisma/generated/prisma/client";

//  Internal type aliases (derived from Prisma)

export type DesignCriteriaFields = Pick<
  MethodArticle,
  | "quantitative"
  | "qualitative"
  | "deductive"
  | "inductive"
  | "individual"
  | "system"
  | "global"
  | "past"
  | "present"
  | "future"
>;

export type ExtractedMetadata = Pick<
  MethodArticle,
  | "description"
  | "articleType"
  | "normativity"
  | "wikiCategories"
  | "quantitative"
  | "qualitative"
  | "deductive"
  | "inductive"
  | "individual"
  | "system"
  | "global"
  | "past"
  | "present"
  | "future"
>;

// Constants
// known MediaWiki categories that map to design criteria fields
const DESIGN_CRITERIA_CATEGORIES = new Set([
  "Quantitative",
  "Qualitative",
  "Deductive",
  "Inductive",
  "Individual",
  "System",
  "Global",
  "Past",
  "Present",
  "Future",
]);

// Image filename abbreviation codes -> flat MethodArticle field names
const IMAGE_CODE_MAP: Readonly<Record<string, keyof DesignCriteriaFields>> = {
  quan: "quantitative",
  qual: "qualitative",
  dedu: "deductive",
  indu: "inductive",
  indi: "individual",
  syst: "system",
  glob: "global",
  past: "past",
  pres: "present",
  futu: "future",
};

// Pages to skip during sync (meta-pages, not articles)
export const EXCLUDED_PAGES: ReadonlySet<string> = new Set([
  "Main_Page",
  "Methods",
  "All_Entries",
  "Glossary",
  "Blog",
  "Courses",
  "Hacks,_Habits_&_Tools",
  "Normativity_of_Methods",
  "Table_of_Contributors",
]);

// Helpers
const createEmptyDesignCriteriaFields = (): DesignCriteriaFields => ({
  quantitative: false,
  qualitative: false,
  deductive: false,
  inductive: false,
  individual: false,
  system: false,
  global: false,
  past: false,
  present: false,
  future: false,
});

//  Strategy 1: MediaWiki API categories
/**
 * Parses categories returned by the MediaWiki `prop=categories` API.
 * Categories arrive as [{ ns: 14, title: "Category:Qualitative" }, ...]
 */

export const extractFromWikiCategories = (
  categories: Array<{ ns: number; title: string }>,
): Pick<
  ExtractedMetadata,
  keyof DesignCriteriaFields | "normativity" | "articleType" | "wikiCategories"
> => {
  const categoryNames = categories.map((cat) =>
    cat.title.replace(/^Category:/, ""),
  );

  const normativity = categoryNames.includes("Normativity of Methods");
  const hasDesignCriteria = categoryNames.some((name) =>
    DESIGN_CRITERIA_CATEGORIES.has(name),
  );
  const isMethodCategory =
    categoryNames.includes("Methods") || hasDesignCriteria;

  const articleType: ArticleType = isMethodCategory
    ? "METHOD"
    : normativity
      ? "NORMATIVITY"
      : "OTHER";

  const designCriteriaFields = hasDesignCriteria
    ? categoryNames.reduce((acc, name) => {
        const key = name.toLowerCase() as keyof DesignCriteriaFields;
        if (key in acc) acc[key] = true;
        return acc;
      }, createEmptyDesignCriteriaFields())
    : createEmptyDesignCriteriaFields();

  return {
    ...designCriteriaFields,
    normativity,
    articleType,
    wikiCategories: categoryNames,
  };
};

// Strategy 2: Image filename
/**
 * Parses the categorization image filename embedded in article HTML.
 * Filenames encode criteria: Quan_dedu_indu_indi_syst_glob_pres.png
 * Returns null if no categorization image is found.
 */
export const extractFromImageFilename = (
  html: string,
): DesignCriteriaFields | null => {
  const imagePattern =
    /(?:src|srcset)="[^"]*\/([A-Z][a-z]+(?:_[A-Za-z]+)*)\.png/gi;

  let match: RegExpExecArray | null;
  while ((match = imagePattern.exec(html)) !== null) {
    const parts = match[1].toLowerCase().split("_");
    const matchedCodes = parts.filter((part) => part in IMAGE_CODE_MAP);

    if (matchedCodes.length >= 2) {
      const criteria = createEmptyDesignCriteriaFields();
      for (const code of matchedCodes) {
        criteria[IMAGE_CODE_MAP[code]] = true;
      }
      return criteria;
    }
  }
  return null;
};

// Strategy 3: Bold text fallback
/**
 * Parses the "Method Categorisation" section where bold terms indicate
 * active categories. Used as a last resort when the API and image both fail.
 */

export const extractFromBoldText = (
  html: string,
): DesignCriteriaFields | null => {
  const categorizationPattern =
    /Method\s+Categori[sz]ation[:\s]*<\/[^>]+>?\s*([\s\S]*?)(?:<h[1-6]|<div\s+class="mw-heading|In\s+short)/i;

  const sectionMatch = categorizationPattern.exec(html);
  if (!sectionMatch) return null;

  const section = sectionMatch[1];
  const criteria = createEmptyDesignCriteriaFields();
  let foundAny = false;

  const boldPattern = /<b>([^<]+)<\/b>|<strong>([^<]+)<\/strong>/gi;
  let boldMatch: RegExpExecArray | null;

  while ((boldMatch = boldPattern.exec(section)) !== null) {
    const term = (boldMatch[1] ?? boldMatch[2])
      .trim()
      .toLowerCase() as keyof DesignCriteriaFields;
    if (term in criteria) {
      criteria[term] = true;
      foundAny = true;
    }
  }

  return foundAny ? criteria : null;
};

// Description extraction
/**
 * Extracts the "In short:" introductory description present in most articles.
 * Returns null if not found or too short. Truncates at 500 characters.
 */
export const extractDescription = (html: string): string | null => {
  const pattern =
    /(?:<b>|<strong>)\s*(?:In\s+short|Kurz\s+und\s+knapp)[:\s]*(?:<\/b>|<\/strong>)\s*([\s\S]*?)(?=<h[1-6]|<div\s+(?:id="toc"|class="mw-heading)|<table|<figure|$)/i;
  const match = pattern.exec(html);
  if (!match) return null;
  const text = match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .replace(/\[\d+\]/g, "")
    .trim();

  if (text.length < 10) return null;
  return text.length > 500 ? `${text.slice(0, 497)}...` : text;
};

// Master extraction function
/**
 * Combines all strategies to extract complete metadata from article HTML
 * and MediaWiki API categories.
 *
 * Priority for design criteria:
 * 1. MediaWiki API categories (structured, most reliable)
 * 2. Image filename parsing (fast, unambiguous)
 * 3. Bold text parsing (last resort)
 *
 * articleType rule: any article where design criteria are found by any strategy
 * is classified as METHOD. The normativity boolean flag independently records
 * whether the page also belongs to the "Normativity of Methods" category.
 */

// Internal helper — assembles the return value for Strategy 2 and Strategy 3.
// Keeps articleType logic in one place and eliminates duplicated return blocks.

const buildFallbackMetadata = (
  description: string | null,
  criteria: DesignCriteriaFields,
  categoryData: Pick<ExtractedMetadata, "normativity" | "wikiCategories">,
): ExtractedMetadata => ({
  description,
  ...criteria,
  normativity: categoryData.normativity,
  // Criteria were found — this is a METHOD regardless of what categories inferred.
  // normativity: true is preserved above as a separate orthogonal flag.
  articleType: "METHOD",
  wikiCategories: categoryData.wikiCategories,
});

export const extractArticleMetadata = (
  html: string,
  wikiCategories: Array<{ ns: number; title: string }>,
): ExtractedMetadata => {
  const description = extractDescription(html);

  // Strategy 1: Mediawiki categories
  const categoryData = extractFromWikiCategories(wikiCategories);
  const hasDesignCriteria = Object.keys(createEmptyDesignCriteriaFields()).some(
    (key) => categoryData[key as keyof DesignCriteriaFields],
  );

  if (hasDesignCriteria) {
    return { description, ...categoryData };
  }

  // Strategy 2: Image filename
  const imageDesignCriteria = extractFromImageFilename(html);
  if (imageDesignCriteria) {
    return buildFallbackMetadata(
      description,
      imageDesignCriteria,
      categoryData,
    );
  }

  // Strategy 3: Bold text fallback
  const boldDesignCriteria = extractFromBoldText(html);
  if (boldDesignCriteria) {
    return buildFallbackMetadata(description, boldDesignCriteria, categoryData);
  }

  // No design criteria found by any strategy
  return {
    description,
    ...createEmptyDesignCriteriaFields(),
    normativity: categoryData.normativity,
    articleType: categoryData.articleType,
    wikiCategories: categoryData.wikiCategories,
  };
};
