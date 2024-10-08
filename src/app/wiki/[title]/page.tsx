import { fetchPageContent } from "@/lib/fetchData";
import styles from "./wiki.module.css";

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
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
