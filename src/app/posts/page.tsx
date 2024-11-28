import prisma from "@/lib/db";
import styles from "./posts.module.css";
import Link from "next/link";
import { createPost } from "@/lib/actions";
import PostCard from "@/components/postCard/postCard";

const PostsPage = async ({
  searchParams,
}: {
  searchParams: { error?: string };
}) => {
  const posts = await prisma.post.findMany();

  const postsCount = await prisma.post.count();
  const error =
    searchParams.error === "duplicate-title"
      ? "A post with this title already exists. Please choose a different title."
      : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>All Posts ({postsCount})</h1>

      {/* create a form with server action */}
      <form method="post" action={createPost} className={styles.form}>
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
          <Link key={post.id} href={`./posts/${post.slug}`}>
            <PostCard id={post.id} title={post.title} content={post.content} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
