import type { MethodArticle, ArticleType } from "@generated/prisma/client";
import type {
  CriteriaAxis,
  MethodGraphData,
  MethodGraphLink,
  MethodGraphNode,
} from "@/components/charts/chartTypes";

// The subset of MethodArticle a graph node needs. Keeping this as a Pick of the
// Prisma model means the select in the Server Component and this transformer
// can never silently drift apart.
export type GraphArticleInput = Pick<
  MethodArticle,
  | "pageid"
  | "title"
  | "description"
  | "articleType"
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

// The boolean design-criteria keys on a graph article (everything that isn't
// identity/metadata). Derived from the type above so adding a criterion to the
// schema surfaces here as a type error rather than being silently ignored.
type CriteriaValueKey = Exclude<
  keyof GraphArticleInput,
  "pageid" | "title" | "description" | "articleType"
>;

// Design-criteria axes → the MethodArticle boolean keys each one groups.
const CRITERIA_AXES: ReadonlyArray<{
  axis: CriteriaAxis;
  values: ReadonlyArray<CriteriaValueKey>;
}> = [
  { axis: "type", values: ["quantitative", "qualitative"] },
  { axis: "reasoning", values: ["deductive", "inductive"] },
  { axis: "level", values: ["individual", "system", "global"] },
  { axis: "time", values: ["past", "present", "future"] },
];

// articleType → category-hub label + color group key.
const CATEGORY_META: Record<ArticleType, { label: string; group: string }> = {
  METHOD: { label: "Methods", group: "method" },
  NORMATIVITY: { label: "Normativity", group: "normativity" },
  OTHER: { label: "Other", group: "other" },
};

const categoryHubId = (type: ArticleType): string => `cat:${type}`;
const criteriaHubId = (value: string): string => `crit:${value}`;
const articleNodeId = (pageid: number): string => `art:${pageid}`;

const titleCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const NODE_SIZE = { category: 22, criteria: 13, article: 6 } as const;

/**
 * Transforms synced MethodArticle rows into a hub-and-spoke graph.
 *
 * Every article links to exactly one category hub (its articleType) and to one
 * criteria hub per design-criterion it satisfies. Methods that share a
 * criterion therefore cluster around a shared hub — the similarity emerges
 * structurally, with no O(n²) pairwise edges, so the graph stays sparse and
 * readable at the full corpus size. Hubs that no article references are
 * omitted, so the output reflects only what is actually in the data.
 */

export function buildMethodGraph(
  articles: ReadonlyArray<GraphArticleInput>,
): MethodGraphData {
  const presentTypes = new Set<ArticleType>(
    articles.map((article) => article.articleType),
  );
  const usedCriteria = new Set<CriteriaValueKey>();

  const articleNodes: MethodGraphNode[] = [];
  const links: MethodGraphLink[] = [];

  articles.forEach((article) => {
    const nodeId = articleNodeId(article.pageid);

    articleNodes.push({
      id: nodeId,
      group: CATEGORY_META[article.articleType].group,
      nodeType: "article",
      label: article.title.replace(/_/g, " "),
      pageid: article.pageid,
      description: article.description,
      size: NODE_SIZE.article,
    });

    // Category membership — guarantees every article is connected.
    links.push({
      source: nodeId,
      target: categoryHubId(article.articleType),
      value: 2,
      linkType: "category",
    });

    // One link per satisfied design criterion.
    CRITERIA_AXES.forEach(({ axis, values }) => {
      values
        .filter((key) => article[key] === true)
        .forEach((key) => {
          usedCriteria.add(key);
          links.push({
            source: nodeId,
            target: criteriaHubId(key),
            value: 1,
            linkType: "criteria",
            axis,
          });
        });
    });
  });

  const categoryNodes: MethodGraphNode[] = [...presentTypes].map((type) => ({
    id: categoryHubId(type),
    group: CATEGORY_META[type].group,
    nodeType: "category",
    label: CATEGORY_META[type].label,
    articleType: type,
    size: NODE_SIZE.category,
  }));

  const criteriaNodes: MethodGraphNode[] = CRITERIA_AXES.flatMap(
    ({ axis, values }) =>
      values
        .filter((key) => usedCriteria.has(key))
        .map((key) => ({
          id: criteriaHubId(key),
          group: axis,
          nodeType: "criteria" as const,
          label: titleCase(key),
          axis,
          size: NODE_SIZE.criteria,
        })),
  );

  return {
    // Hubs first so they are painted under the denser article layer.
    nodes: [...categoryNodes, ...criteriaNodes, ...articleNodes],
    links,
  };
}
