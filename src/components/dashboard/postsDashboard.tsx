import FilterDropdown from "../filterDropdown/filterDropdown";
import PostCard from "../postCard/postCard";
import styles from "./dashboard.module.css";

type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  wikiArticle?: string;
  createdAt?: Date | string;
};

export type PostsDashboardProps = {
  posts: Post[];
  uniqueWikiArticles: { wikiArticle: string | null }[];
  currentFilter?: string;
};

const PostsDashboard = ({
  posts,
  uniqueWikiArticles,
  currentFilter,
}: PostsDashboardProps) => {
  return (
    <div className={styles.dashboardContainer}>
      <FilterDropdown
        uniqueWikiArticles={uniqueWikiArticles}
        currentFilter={currentFilter}
      />

      <div className={styles.postsGrid}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <PostCard
                id={post.id}
                title={post.title}
                content={post.content}
                slug={post.slug}
                wikiArticle={post.wikiArticle || undefined}
                createdAt={post.createdAt}
              />
            </div>
          ))
        ) : (
          <div className={styles.noPostsMessage}>
            <p>No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsDashboard;
