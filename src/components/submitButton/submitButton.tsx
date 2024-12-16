"use client";

import { useFormStatus } from "react-dom";
import styles from "./submitButton.module.css";

type SubmitButtonProps = {
  defaultText: string;
  loadingText: string;
};

const SubmitButton = ({ defaultText, loadingText }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={styles.submitButton}>
      {pending ? loadingText : defaultText}
    </button>
  );
};

export default SubmitButton;
