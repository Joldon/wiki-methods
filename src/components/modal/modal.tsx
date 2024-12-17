"use client";
import styles from "./modal.module.css";
import Button from "../buttons/button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this post?</p>
      </div>
      <div className={styles.buttons}>
        {/* <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Delete</button> */}
        <Button
          defaultText="Cancel"
          loadingText="Cancelling ..."
          variant="default"
          onClick={onClose}
        />
        <Button
          defaultText="Delete"
          loadingText="Deleting ..."
          variant="danger"
          onClick={onConfirm}
        />
      </div>
    </div>
  );
};

export default Modal;
