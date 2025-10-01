import { fetchPageContent } from "@/lib/fetchData";
import styles from "./wiki.module.css";
import Link from "next/link";

type Params = {
  title: string;
};

export default async function WikiPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { title } = await params;
  const content = await fetchPageContent(title);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title.replace("_", " ")}</h1>
      {/* feedback button that links to posts page */}

      <div className={styles.feedbackContainer}>
        <Link
          href={`/posts/new?wiki=${encodeURIComponent(title)}`}
          className={styles.feedbackButton}
        >
          Provide Feedback on this Article
        </Link>
      </div>

      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
