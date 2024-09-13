import styles from "./postCard.module.css";

interface PostCardProps {
  title: string;
  content: string;
}

const PostCard: React.FC<PostCardProps> = ({ title, content }) => {
  return (
    <div className={styles.postCard}>
      <h2 className={styles.postTitle}>{title}</h2>
      <p className={styles.postContent}>
        {content && `${content.slice(0, 35)}...`}
      </p>
    </div>
  );
};

export default PostCard;
