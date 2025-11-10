"use client";

import styles from "./postForm.module.css";
import { createPost } from "@/lib/actions";
import Button from "../buttons/button";
import { useRouter } from "next/navigation";

export type PostFormProps = {
  wikiArticle?: string;
  className?: string;
};

export default function PostForm({ wikiArticle, className }: PostFormProps) {
  const router = useRouter();

  // const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
  const handleCancel = () => {
    // e.preventDefault();
    if (wikiArticle) {
      router.push(`/wiki/${encodeURIComponent(wikiArticle)}`);
    } else {
      router.push("/wiki");
    }
  };

  return (
    <form action={createPost} className={`${styles.form} ${className || ""}`}>
      <h2 className={styles.subheader}>Create a new post</h2>

      <input type="text" name="title" id="title" placeholder="Title" required />

      <textarea
        name="content"
        id="content"
        placeholder="Your feedback"
        required
      />

      {wikiArticle && (
        <input type="hidden" name="wikiArticle" value={wikiArticle} />
      )}

      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          type="submit"
          defaultText="Create Post"
          loadingText="Creating..."
          variant="primary"
        />
        <Button
          type="button"
          defaultText="Cancel"
          loadingText="Cancelling..."
          variant="default"
          onClick={handleCancel}
        />
      </div>
    </form>
  );
}
