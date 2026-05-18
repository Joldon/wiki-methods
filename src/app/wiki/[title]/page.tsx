import { fetchPageContent } from "@/lib/fetchData";
import styles from "./wiki.module.css";
import Link from "next/link";

type Params = {
  title: string;
};

function sanitizeWikiHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<(iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(iframe|object|embed)\b[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]\w*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*/gi, '$1="#"');
}

export default async function WikiPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { title } = await params;
  const decodedTitle = decodeURIComponent(title);
  const queryParams = await searchParams;
  const content = await fetchPageContent(decodedTitle);
  const sanitizedContent = sanitizeWikiHtml(content);

  const successMessage =
    queryParams.success === "feedback-created"
      ? "Your feedback has been submitted successfully!"
      : undefined;
  const errorMessage =
    queryParams.error === "duplicate-title"
      ? "A post with this title already exists. Please choose a different title."
      : queryParams.error === "failed"
        ? "Failed to create feedback post. Please try again."
        : undefined;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{decodedTitle.replace(/_/g, " ")}</h1>
      {successMessage && (
        <div
          // Replace the below with proper css varibales in wiki.module.css
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
          }}
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
          }}
        >
          {errorMessage}
        </div>
      )}
      {/* feedback button that links to posts page */}

      <div className={styles.feedbackContainer}>
        <Link
          href={`/posts/new?wiki=${encodeURIComponent(decodedTitle)}`}
          className={styles.feedbackButton}
        >
          Provide Feedback on this Article
        </Link>
      </div>

      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}
