"use client";

import styles from "./postForm.module.css";
import { createPost } from "@/lib/actions";
import Button from "../buttons/button";

export type PostFormProps = {
  wikiArticle?: string;
  className?: string;
};

export default function PostForm({ wikiArticle, className }: PostFormProps) {
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

      <Button
        type="submit"
        defaultText="Create Post"
        loadingText="Creating..."
        variant="primary"
      />
    </form>
  );
}
