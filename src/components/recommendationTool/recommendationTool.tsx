"use client";
import { useState } from "react";
import styles from "./recommendationTool.module.css";
import { filterMethods, MethodType, categories } from "@/lib/starterData";
import CheckboxBlock from "../checkboxBlock/checkboxBlock";

const RecommendationTool = () => {
  // specify the type of the methods state to be MethodType[]
  // by importing MethodType from the starterData file
  const [methods, setMethods] = useState<MethodType[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const filteredMethods = await filterMethods(formData);
    setMethods(filteredMethods);
  };

  return (
    <div className={styles.container}>
      <h1>Method Recommendation Tool</h1>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <form onSubmit={handleSubmit}>
            {/* Dynamically render input blocks based on the categories object */}
            {Object.keys(categories).map((category) => (
              <CheckboxBlock
                key={category}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
                options={categories[category as keyof typeof categories]}
              />
            ))}

            <button type="submit" className={styles.submitButton}>
              Get Recommendations
            </button>
          </form>
        </aside>

        <main className={styles.mainContent}>
          <h2>Recommended Methods</h2>
          <ul className={styles.methodList}>
            {methods.length > 0 ? (
              methods.map((method) => (
                <li key={method.method} className={styles.methodCard}>
                  <h3>{method.method}</h3>
                  <p>{method.description}</p>
                </li>
              ))
            ) : (
              <p>No methods match the selected criteria.</p>
            )}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default RecommendationTool;
