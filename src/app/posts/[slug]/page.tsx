import prisma from "@/lib/db";
import styles from "./post.module.css";

interface Params {
  slug: string;
}

const Post = async ({ params }: { params: Params }) => {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post?.title}</h1>
      <p className={styles.content}>{post?.content}</p>
    </div>
  );
};

export default Post;
