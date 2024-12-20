"use client";
import styles from "./modal.module.css";
import Button from "../buttons/button";
import { deletePost } from "@/lib/actions";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, postId }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this post?</p>
      </div>
      <div className={styles.buttons}>
        <Button
          defaultText="Cancel"
          loadingText="Cancelling ..."
          variant="default"
          onClick={onClose}
        />
        <form
          action={async () => {
            await deletePost(postId);
          }}
        >
          <Button
            type="submit"
            defaultText="Delete"
            loadingText="Deleting ..."
            variant="danger"
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;
