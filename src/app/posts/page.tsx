import prisma from "@/lib/db";
import styles from "./posts.module.css";
import Link from "next/link";
const PostsPage = async () => {
  const posts = await prisma.post.findMany();
  return (
    <div>
      <h1>All Posts (0)</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;

// export const PostCard = ({ title, content }) => {
//     return (
//         <div className={styles.post-card}>
//             <h2 className={styles.post-title}>{title}</h2>
//             <p className={styles.post-content}>{content}</p>
//         </div>
//     );
// };
