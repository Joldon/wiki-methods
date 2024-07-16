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
  console.log(content);

  return (
    <div className="container">
      <h1>{title.replace("_", " ")}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
