import { ArticleType, type Prisma } from "@generated/prisma/client";

export const ARTICLE_TYPE_OPTIONS = [
  { key: "methods", label: "Methods" },
  { key: "normativity", label: "Normativity" },
  { key: "tools", label: "Hacks & Tools" },
  { key: "statistics", label: "Statistics" },
  { key: "python", label: "Python" },
  { key: "other", label: "Other" },
] as const;

export type ArticleTypeKey = (typeof ARTICLE_TYPE_OPTIONS)[number]["key"];

export const ARTICLE_TYPE_WHERE: Record<
  ArticleTypeKey,
  Prisma.MethodArticleWhereInput
> = {
  methods: { articleType: "METHOD" },
  normativity: { normativity: true },
  tools: {
    wikiCategories: {
      has: "Hacks, Habits & Tools",
    },
  },
  statistics: { wikiCategories: { has: "Statistics" } },
  python: { wikiCategories: { has: "Python" } },
  other: { articleType: "OTHER" },
};
