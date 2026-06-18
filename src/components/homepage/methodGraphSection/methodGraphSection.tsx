import { buildMethodGraph, GraphArticleInput } from "@/lib/buildMethodGraph";
import prisma from "@/lib/db";
import styles from "./methodGraphSection.module.css";
import MethodGraphClient from "./methodGraphClient";

const GRAPH_SELECT = {
  pageid: true,
  title: true,
  description: true,
  articleType: true,
  quantitative: true,
  qualitative: true,
  deductive: true,
  inductive: true,
  individual: true,
  system: true,
  global: true,
  past: true,
  present: true,
  future: true,
} as const;

const MethodGraphSection = async () => {
  const articles: GraphArticleInput[] = await prisma.methodArticle.findMany({
    select: GRAPH_SELECT,
    orderBy: { title: "asc" },
  });

  const graph = buildMethodGraph(articles);
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.label}>Explore the methods</span>
          <h2 className={styles.title}>Methods network</h2>
          <p className={styles.subtitle}>
            {" "}
            All {articles.length} entries, connected by the design criteria they
            share: type, reasoning, scale, and time. Pick a criterion in the
            legend to focus the network, or open any article straight from its
            node.
          </p>
        </header>
        <MethodGraphClient
          nodes={graph.nodes}
          links={graph.links}
          height={700}
        />
      </div>
    </section>
  );
};

export default MethodGraphSection;
