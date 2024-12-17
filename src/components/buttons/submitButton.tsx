"use client";

import { useFormStatus } from "react-dom";
import styles from "./baseButton.module.css";

type SubmitButtonProps = {
  defaultText: string;
  loadingText: string;
  variant?: "primary" | "danger" | "default";
};

const SubmitButton = ({
  defaultText,
  loadingText,
  variant = "primary",
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${styles.button} ${styles[variant]}`}
    >
      {pending ? loadingText : defaultText}
    </button>
  );
};

export default SubmitButton;
