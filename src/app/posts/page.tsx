import prisma from "@/lib/db";
import styles from "./posts.module.css";
import Link from "next/link";
import { createPost } from "@/lib/action";
const PostsPage = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
  });
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>All Posts ({posts.length})</h1>
      <ul className={styles.ul}>
        {posts.map((post) => (
          <li key={post.id} className={styles.li}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>

      {/* create a form with server action */}
      <form method="post" action={createPost} className={styles.form}>
        <h2 className={styles.subheader}>Create a new post</h2>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" required />
        <label htmlFor="content">Content</label>
        <textarea name="content" id="content" required></textarea>
        <button type="submit">Create post</button>
      </form>
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
