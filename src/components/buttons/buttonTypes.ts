export type BaseButtonProps = {
  defaultText: string;
  loadingText: string;
  variant?: "primary" | "danger" | "default";
};

export type ActionButtonProps = BaseButtonProps & {
  onClick: () => Promise<void>;
};

export type SubmitButtonProps = BaseButtonProps;
