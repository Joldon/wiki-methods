"use client";

import { useFormStatus } from "react-dom";
import styles from "./button.module.css";

type ButtonType = "submit" | "button";
type ButtonVariant = "primary" | "danger" | "default";

type ButtonProps = {
  defaultText: string;
  loadingText: string;
  variant?: ButtonVariant;
  type?: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

const Button = ({
  defaultText,
  loadingText,
  type,
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
  ariaLabel,
}: ButtonProps) => {
  const { pending } = useFormStatus();
  const isLoading = type === "submit" ? pending : false;
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      role="button"
    >
      {isLoading ? loadingText : defaultText}
    </button>
  );
};

export default Button;
