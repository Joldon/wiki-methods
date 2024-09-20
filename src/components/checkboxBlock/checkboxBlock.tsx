import styles from "./checkboxBlock.module.css";

interface CheckboxBlockProps {
  title: string;
  options: string[];
}

const CheckboxBlock: React.FC<CheckboxBlockProps> = ({ title, options }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {options.map((option) => (
        <label key={option}>
          {/* capitalizes first letter of the label */}
          <input type="checkbox" name={option} />{" "}
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </label>
      ))}
    </div>
  );
};

export default CheckboxBlock;
