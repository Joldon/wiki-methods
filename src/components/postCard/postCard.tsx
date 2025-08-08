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

  return (
    <>
      <div
        className={`${styles.postCardContainer} ${styles.postCard}`}
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
      >
        <h2 className={styles.postTitle}>
          <Link href={`./posts/${slug}`} className={styles.titleLink}>
            {title}
          </Link>
        </h2>
        {/* Displays wiki article reference if available */}
        {wikiArticle && (
          <p className={styles.wikiReference}>
            <span>Article: </span>
            <Link
              href={`/posts?wiki=${encodeURIComponent(wikiArticle)}`} //added /post?
            >
              {wikiArticle.replace(/_/g, " ")}
            </Link>
          </p>
        )}

        <p className={styles.postContent}>
          {content && `${content.slice(0, 35)}...`}
        </p>
        {showDelete && (
          <button className={styles.deleteButton} onClick={handleModalOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm3 2v9h2v-9H8zm4 0v9h2v-9h-2zm4 0v9h2v-9h-2zM9 4V2h6v2h5v2H4V4h5z" />
            </svg>
          </button>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        postId={id}
      />
    </>
  );
};

export default PostCard;
