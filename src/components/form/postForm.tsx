"use client";

import styles from "./postForm.module.css";
import { useFormState } from "react-dom";
import { createPost, FormState } from "@/lib/actions";
import Button from "../buttons/button";

export type PostFormProps = {
  wikiArticle?: string;
  className?: string;
};

const initialState: FormState = {
  error: undefined,
  success: undefined,
};

export default function PostForm({ wikiArticle, className }: PostFormProps) {
  const [state, formAction] = useFormState(createPost, initialState);

  return (
    <form action={formAction} className={`${styles.form} ${className || ""}`}>
      <h2 className={styles.subheader}>Create a new post</h2>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {state?.success && <p className={styles.success}>{state.success}</p>}

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
