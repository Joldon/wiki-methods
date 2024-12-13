import prisma from "@/lib/db";
import styles from "./posts.module.css";
import Link from "next/link";
import { createPost } from "@/lib/actions";
import PostCard from "@/components/postCard/postCard";
import { clearScreenDown } from "readline";
import { NEXT_CACHE_TAG_MAX_LENGTH } from "next/dist/lib/constants";

const PostsPage = async ({
  searchParams,
}: {
  searchParams: { error?: string };
}) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
    },
  });

  const postsCount = await prisma.post.count();
  const error =
    searchParams.error === "duplicate-title"
      ? "A post with this title already exists. Please choose a different title."
      : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>All Posts ({postsCount})</h1>

      {/* create a form with server action */}
      <form action={createPost} className={styles.form}>
        <h2 className={styles.subheader}>Create a new post</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          required
        />

        <textarea
          name="content"
          id="content"
          placeholder="Your feedback"
          required
        ></textarea>

        <button type="submit">Create post</button>
      </form>
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard
              id={post.id}
              title={post.title}
              content={post.content}
              slug={post.slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
