import prisma from "@/lib/db";
import styles from "./posts.module.css";
import Link from "next/link";
import PostsDashboard from "@/components/dashboard/postsDashboard";

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

      {/*"Show all posts" link when filter is active  */}
      {wikiFilter && (
        <div className={styles.filterMessage}>
          <Link href="/posts" className={styles.clearFilterLink}>
            Show all posts
          </Link>
        </div>
      )}

      <PostsDashboard
        posts={posts.map((post) => ({
          ...post,
          wikiArticle: post.wikiArticle ?? undefined, // Converts null to undefined
        }))}
        uniqueWikiArticles={uniqueWikiArticles}
        currentFilter={wikiFilter}
      />
    </div>
  );
};

export default PostsPage;
