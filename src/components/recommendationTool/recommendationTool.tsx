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

      <form onSubmit={handleSubmit}>
        {/* Dynamically render input blocks based on the categories object */}
        {Object.keys(categories).map((category) => (
          <CheckboxBlock
            key={category}
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            options={categories[category as keyof typeof categories]}
          />
        ))}
        {/* <div>
          <h3>Type</h3>
          <label>
            <input type="checkbox" name="quantitative" /> Quantitative
          </label>
          <label>
            <input type="checkbox" name="qualitative" /> Qualitative
          </label>
        </div>

        <div>
          <h3>Reasoning</h3>
          <label>
            <input type="checkbox" name="deductive" /> Deductive
          </label>
          <label>
            <input type="checkbox" name="inductive" /> Inductive
          </label>
        </div>

        <div>
          <h3>Level</h3>
          <label>
            <input type="checkbox" name="individual" /> Individual
          </label>
          <label>
            <input type="checkbox" name="system" /> System
          </label>
          <label>
            <input type="checkbox" name="global" /> Global
          </label>
        </div>

        <div>
          <h3>Time</h3>
          <label>
            <input type="checkbox" name="past" /> Past
          </label>
          <label>
            <input type="checkbox" name="present" /> Present
          </label>
          <label>
            <input type="checkbox" name="future" /> Future
          </label>
        </div> */}

        <button type="submit">Get Recommendations</button>
      </form>

      <div>
        <h2>Recommended Methods</h2>
        <ul>
          {methods.length > 0 ? (
            methods.map((method, index) => (
              <li key={index}>
                <h3>{method.method}</h3>
                <p>{method.description}</p>
              </li>
            ))
          ) : (
            <p>No methods match the selected criteria.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RecommendationTool;

// import styles from "./recommendationTool.module.css";
// import { filterMethods, starterData } from "@/lib/starterData";

// const RecommendationTool = async () => {
//   const methods = await filterMethods(formData: FormData);
//   return (
//     <div className={styles.container}>
//       <h1>Method Recommendation Tool</h1>

//       <form action={filterMethods}>
//         {/* Checkboxes for the criteria */}
//         <div>
//           <h3>Type</h3>
//           <label>
//             <input type="checkbox" name="quantitative" /> Quantitative
//           </label>
//           <label>
//             <input type="checkbox" name="qualitative" /> Qualitative
//           </label>
//         </div>

//         <div>
//           <h3>Reasoning</h3>
//           <label>
//             <input type="checkbox" name="deductive" /> Deductive
//           </label>
//           <label>
//             <input type="checkbox" name="inductive" /> Inductive
//           </label>
//         </div>

//         <div>
//           <h3>Level</h3>
//           <label>
//             <input type="checkbox" name="individual" /> Individual
//           </label>
//           <label>
//             <input type="checkbox" name="system" /> System
//           </label>
//           <label>
//             <input type="checkbox" name="global" /> Global
//           </label>
//         </div>

//         <div>
//           <h3>Time</h3>
//           <label>
//             <input type="checkbox" name="past" /> Past
//           </label>
//           <label>
//             <input type="checkbox" name="present" /> Present
//           </label>
//           <label>
//             <input type="checkbox" name="future" /> Future
//           </label>
//         </div>

//         <button type="submit">Get Recommendations</button>
//       </form>

//       <div>
//         <h2>Recommended Methods</h2>
//         <ul>
//           {methods.length > 0 ? (
//             methods.map((method, index) => (
//               <li key={index}>
//                 <h3>{method.method}</h3>
//                 <p>{method.description}</p>
//               </li>
//             ))
//           ) : (
//             <p>No methods match the selected criteria.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default RecommendationTool;
