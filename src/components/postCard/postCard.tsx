"use client";
import React, { useState } from "react";
import { deletePost } from "@/lib/actions";
import styles from "./postCard.module.css";

type PostCardProps = {
  title: string;
  content: string;
  id: string;
};

const PostCard: React.FC<PostCardProps> = ({ title, content, id }) => {
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure to delete this post?")) {
      await deletePost(id);
      window.location.reload();
    }
  };
  return (
    <div
      className={styles.postCard}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <h2 className={styles.postTitle}>{title}</h2>
      <p className={styles.postContent}>
        {content && `${content.slice(0, 35)}...`}
      </p>
      {showDelete && (
        <button className={styles.deleteButton} onClick={handleDelete}>
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
  );
};

export default PostCard;
