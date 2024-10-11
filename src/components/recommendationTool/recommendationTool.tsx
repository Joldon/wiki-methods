"use client";
import { useState } from "react";
import styles from "./recommendationTool.module.css";
import { filterMethods, MethodType, categories } from "@/lib/starterData";
import CheckboxBlock from "../checkboxBlock/checkboxBlock";
import Link from "next/link";

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
    <>
    <h1 className={styles.title}>Method Recommendation Tool</h1>
    <div className={styles.containerIntro}>
    <p className={styles.introText}>This page provides an overview of scientific methods we deem suitable for beginners. 
      If you are wondering where to start your journey with methods in science, this is for you. 
      Here, you can get an initial overview, explore different methods and get inspired. 
      The tool can also be used to search for an appropriate method for your research project.</p>

    <p className={styles.introText}>If you are looking for a complete list of all scientific methods featured on this wiki, 
      including more advanced methods, please go to the <a href="https://sustainabilitymethods.org/index.php/Methods" className={styles.link}>Methods</a> page.</p>

    <p className={styles.introText}><b>How to use the “method recommendation tool.</b><br />
    Below you can see a list of all starter methods if you press the &quot;Get Recommendations&quot; button. 
    Alternatively, you can narrow down the selection to methods that are interesting to you or suitable for your project. 
    To do so, use the checkboxes to filter methods according to the <a href="https://sustainabilitymethods.org/index.php/Design_Criteria_of_Methods" className={styles.link}>Design Criteria of Methods.</a></p>

    </div>
    <div className={styles.container}>
      
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
          <h2 className={styles.recommenderTitle}>Recommended Methods</h2>
          <ul className={styles.methodList}>
            {methods.length > 0 ? (
              methods.map((method) => (
                <li key={method.method} className={styles.methodCard}>
                  <Link  
                  href={`/wiki/${encodeURIComponent(
                      method.method.replace(/ /g, "_")
                    )}`}>
                  <h3>{method.method}</h3>
                  <p>{method.description}</p>
                  </Link>
                </li>
              ))
            ) : (
              <p>No methods match the selected criteria.</p>
            )}
          </ul>
        </main>
      </div>
    </div>
    </>
  );
};

export default RecommendationTool;
