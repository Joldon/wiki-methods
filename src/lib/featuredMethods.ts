import { categories, MethodType, starterData } from "./starterData";

export type FeaturedMethod = {
  id: string;
  title: string;
  description: string;
  href: string;
  tag: string;
};

// Helper to convert method name to slug
const toSlug = (name: string) => name.replace(/\s+/g, "_");

// Helper to get a random item from an array
const getRandomItem = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

// Helper to determine a display tag based on method properties
const getMethodTag = (method: MethodType): string => {
  const { type, reasoning, level, time } = method;

  // Prioritize "Mixed Methods" if both quant and qual are true
  // Mixed methods: both quantitative and qualitative
  if (type.quantitative && type.qualitative) {
    return "Mixed Methods";
  }
  // DRY: Dynamically collect all true properties as potential tags
  const potentialTags = Object.keys(categories).flatMap((category) =>
    Object.entries(method[category as keyof MethodType])
      .filter(([, v]) => v)
      .map(([k]) => k)
  );

  // Collect all true properties as potential tags
  //   const potentialTags = [
  //     ...Object.entries(type)
  //       .filter(([, v]) => v)
  //       .map(([k]) => k),
  //     ...Object.entries(reasoning)
  //       .filter(([, v]) => v)
  //       .map(([k]) => k),
  //     ...Object.entries(level)
  //       .filter(([, v]) => v)
  //       .map(([k]) => k),
  //     ...Object.entries(time)
  //       .filter(([, v]) => v)
  //       .map(([k]) => k),
  //   ];

  // Capitalize and return a random tag, or default to "Method"
  const tag = getRandomItem(potentialTags) || "Method";
  return tag.charAt(0).toUpperCase() + tag.slice(1);
};

export const getRandomFeaturedMethods = (
  count: number = 4
): FeaturedMethod[] => {
  // Filter methods that have descriptions
  const validMethods = starterData.filter((m) => m.description);

  // Shuffle and slice to get random methods
  const randomMethods = validMethods
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

  // Map to FeaturedMethod structure
  return randomMethods.map((method) => ({
    id: toSlug(method.method),
    title: method.method,
    description: method.description,
    href: `/wiki/${toSlug(method.method)}`,
    tag: getMethodTag(method),
  }));
};
