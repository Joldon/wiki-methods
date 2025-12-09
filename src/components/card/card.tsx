import Link from "next/link";
import styles from "./card.module.css";

type CardProps = {
  // Content slots (composition pattern)
  children: React.ReactNode;

  header?: React.ReactNode;
  footer?: React.ReactNode;

  // Visual variants
  variant?: "default" | "featured" | "compact";
  interactive?: boolean;

  // Grid behavior (controlled by parent)
  className?: string;

  // Interaction
  onClick?: () => void;
  href?: string; //// If provided, the card becomes a link
};

const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = "default",
  className,
  interactive = false,
  href,
  onClick,
}) => {
  // Combine classes
  const cardClasses = [
    styles.card,
    styles[variant],
    interactive || href ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  //render content
  const content = (
    <>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </>
  );

  // If href is provided, wrap in Link (Server Component friendly)
  if (href) {
    return (
      <Link href={href} className={cardClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  // Otherwise, standard div with slots
  return (
    <div className={cardClasses} onClick={onClick}>
      {content}
    </div>
  );
};

export default Card;
