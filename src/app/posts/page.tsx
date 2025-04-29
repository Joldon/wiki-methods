import prisma from "@/lib/db";
import styles from "./posts.module.css";
import { createPost } from "@/lib/actions";
import PostCard from "@/components/postCard/postCard";
import Button from "@/components/buttons/button";
import Link from "next/link";
import FilterDropdown from "@/components/filterDropdown/filterDropdown";

const PostsPage = async ({
  searchParams,
}: {
  searchParams: { error?: string; wiki?: string };
}) => {
  // Exctract wiki parameter from URL
  const wikiFilter = searchParams.wiki;

  const uniqueWikiArticles = await prisma.post.findMany({
    where: {
      wikiArticle: {
        not: null,
      },
    },
    distinct: ["wikiArticle"],
    select: {
      wikiArticle: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: wikiFilter
      ? {
          wikiArticle: wikiFilter,
        }
      : undefined,
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
      wikiArticle: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const postsCount = await prisma.post.count(
    wikiFilter ? { where: { wikiArticle: wikiFilter } } : undefined
  );
  const error =
    searchParams.error === "duplicate-title"
      ? "A post with this title already exists. Please choose a different title."
      : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        {wikiFilter
          ? `Feedback for ${wikiFilter.replace(/_/g, " ")} (${postsCount})`
          : `All Posts (${postsCount})`}
      </h1>

      <FilterDropdown
        uniqueWikiArticles={uniqueWikiArticles}
        currentFilter={wikiFilter}
      />

      {/*"Show all posts" link when filter is active  */}
      {wikiFilter && (
        <div className={styles.filterMessage}>
          <Link href="/posts" className={styles.clearFilterLink}>
            Show all posts
          </Link>
        </div>
      )}

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

        {/* hidden input to associate post with wiki article */}
        {wikiFilter && (
          <input type="hidden" name="wikiArticle" value={wikiFilter} />
        )}
        {/* <button type="submit">Create post</button>
         */}
        <Button
          type="submit"
          defaultText={"Create Post"}
          loadingText={"Creating ..."}
          variant="primary"
        />
      </form>
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard
              id={post.id}
              title={post.title}
              content={post.content}
              slug={post.slug}
              wikiArticle={post.wikiArticle || undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
