import { fetchPageContent } from "@/lib/fetchData";
import styles from "./wiki.module.css";
import Link from "next/link";

interface Params {
  params: {
    title: string;
  };
}

export default async function WikiPage({ params }: Params) {
  const { title } = params;
  const content = await fetchPageContent(title);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title.replace("_", " ")}</h1>
      {/* feedback button that links to posts page */}
      <div className={styles.feedbackContainer}>
        <Link
          href={`/posts?wiki=${encodeURIComponent(title)}`}
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
