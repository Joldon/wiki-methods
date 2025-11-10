"use client";
import React, { useState } from "react";
import { deletePost } from "@/lib/actions";
import styles from "./postCard.module.css";
import Modal from "../modal/modal";
import Link from "next/link";

type PostCardProps = {
  title: string;
  content: string;
  id: string;
  slug: string;
  wikiArticle?: string;
};

const PostCard: React.FC<PostCardProps> = ({
  title,
  content,
  id,
  slug,
  wikiArticle,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  // Helper for secondary actions
  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <article
        className={`${styles.postCardContainer} ${styles.postCard}`}
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
        tabIndex={0}
        role="button"
        aria-label={`Open post: ${title}`}
        onClick={() => window.location.assign(`/posts/${slug}`)}
        style={{ cursor: "pointer" }}
      >
        {/* Delete button (trash icon) */}
        {showDelete && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              handleModalOpen(e);
            }}
            aria-label="Delete post"
          >
            <span className={styles.icon} aria-hidden="true">
              🗑️
            </span>
          </button>
        )}

        {/* Post title */}
        <h3 className={styles.postTitle}>{title}</h3>

        {/* Wiki article badge */}
        {wikiArticle && (
          <span>
            <span style={{ fontWeight: 600, marginRight: 4 }}>Article: </span>
            <Link
              href={`/wiki/${encodeURIComponent(wikiArticle)}`}
              className={styles.articleBadge}
              onClick={handleSecondaryClick}
              aria-label={`Go to article: ${wikiArticle.replace(/_/g, " ")}`}
            >
              <span>{wikiArticle.replace(/_/g, " ")}</span>
            </Link>
          </span>
        )}

        {/* Content preview */}
        <p className={styles.postContent}>
          {content && `${content.slice(0, 120)}...`}
        </p>

        {/* Meta info */}
        <div className={styles.metaInfo}>
          <span className={styles.date} aria-label="Date">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* Action buttons */}
        <div className={styles.cardActions}>
          <span className={styles.btnPrimary} aria-label="Read more">
            Read More <span className={styles.arrow}>→</span>
          </span>
          {wikiArticle && (
            <Link
              href={`/posts?wiki=${encodeURIComponent(wikiArticle)}`}
              className={styles.btnSecondary}
              onClick={handleSecondaryClick}
              aria-label={`Show all feedback for ${wikiArticle.replace(
                /_/g,
                " "
              )}`}
            >
              <span className={styles.icon}>🔗</span>
              <span>All Feedback</span>
            </Link>
          )}
        </div>
      </article>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        postId={id}
      />
    </>
  );
};

export default PostCard;
