import styles from "./postCard.module.css";

const PostCard = ({ title, content }) => {
  return (
    <div className={styles.postCard}>
      <h2 className={styles.postTitle}>{title}</h2>
      <p className={styles.postContent}>{content}</p>
    </div>
  );
};

export default PostCard;
