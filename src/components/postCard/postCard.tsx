"use client";
import React, { useState } from "react";
import { deletePost } from "@/lib/actions";
import Card from "../card/card";
import styles from "./postCard.module.css";
import Modal from "../modal/modal";
import Link from "next/link";

type PostCardProps = {
  title: string;
  content: string;
  id: string;
  slug: string;
  wikiArticle?: string;
  createdAt?: Date | string; // accept date from database
};

const PostCard: React.FC<PostCardProps> = ({
  title,
  content,
  id,
  slug,
  wikiArticle,
  createdAt,
}) => {
  // Format date safely - only format if we have a real date from the database
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  const [showDelete, setShowDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      {/* Wrapper for hover detection (delete button visibility) */}
      <article
        className={`${styles.postCardWrapper}`}
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
      >
        {/* Delete button - positioned absolute */}
        {showDelete && (
          <button
            className={styles.deleteButton}
            onClick={handleModalOpen}
            aria-label="Delete Post"
          >
            <span className={styles.icon} aria-hidden="true">
              🗑️
            </span>
          </button>
        )}

        {/* Card without href prop to avoid nested <a> tags. We still use `interactive  for hover effects*/}
        <Card
          variant="default"
          interactive
          footer={
            // Footer slot for action
            <div className={styles.cardActions}>
              {/* Bento-style tag buttons */}
              <Link href={`/posts/${slug}`} className={styles.cardTag}>
                Read More →
              </Link>
              {wikiArticle && (
                <Link
                  href={`/posts?wiki=${encodeURIComponent(wikiArticle)}`}
                  className={styles.cardTag}
                >
                  All Feedback
                </Link>
              )}
            </div>
          }
        >
          {/* Post title - clickable link to the post */}
          <h3 className={styles.postTitle}>
            <Link href={`/posts/${slug}`} className={styles.titleLink}>
              {title}
            </Link>
          </h3>

          {/* Wiki article badge */}
          {wikiArticle && (
            <div className={styles.badgeContainer}>
              <span className={styles.badgeLabel}>Article: </span>
              <Link
                href={`/wiki/${encodeURIComponent(wikiArticle)}`}
                className={styles.articleBadge}
              >
                {wikiArticle.replace(/_/g, " ")}
              </Link>
            </div>
          )}
          {/* Content preview */}
          <p className={styles.postContent}>
            {content && `${content.slice(0, 120)}...`}
          </p>

          {/* Meta info */}
          {formattedDate && (
            <div className={styles.metaInfo}>
              <span className={styles.date} aria-label="Date">
                {formattedDate}
              </span>
            </div>
          )}
        </Card>
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
