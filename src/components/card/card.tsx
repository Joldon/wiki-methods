import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.css";

interface CardProps {
  title: string;
  pageId: string;
  summary: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ title, pageId, summary, imageUrl }) => {
  return (
    <div className={styles.container}>
      <Image src={imageUrl} alt={title} width={200} height={200} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>
        <Link
          href={`/wiki/${encodeURIComponent(title.replace(/ /g, "_"))} `}
          className={styles.link}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;
