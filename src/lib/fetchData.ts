// src/lib/fetchData.ts

import { WikiEntry, WikiContent } from "./types";

const API_URL = "https://sustainabilitymethods.org/api.php";
// const BASE_URL = "https://sustainabilitymethods.org/";

export const fetchAllEntries = async (): Promise<WikiEntry[]> => {
  try {
    const response = await fetch(
      `${API_URL}?action=query&list=allpages&format=json&aplimit=max`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.query.allpages;
  } catch (error) {
    console.error("Error fetching all entries:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

// PREVIOUS VERSION OF fetchPageContent THAT DOES NOT CATCH FETCHING ERRORS
// export const fetchPageContent = async (title: string): Promise<string> => {
//   const response = await fetch(
//     `${API_URL}?action=parse&page=${title}&format=json`
//   );
//   const data: WikiContent = await response.json();
//   return data.parse.text["*"];
// };



// new version of fetchPageContent that checks for data.parse and data.parse.text before accessing data.parse.text["*"]
// This prevents the code from breaking if the expected properties are not present
// For example, if the original Wiki article is called "Experiments" but in starterData.ts it is called "Experiment"
// then the API will return an error message instead of the expected data structure
// if the page does not exist, the API will return an error message instead of the expected data structure
// In this case, 
export const fetchPageContent = async (title: string): Promise<string> => {
  const BASE_URL = "https://sustainabilitymethods.org/"; // Define the base URL for the wiki to avoid any type errors
  try {
    const response = await fetch(
      `${API_URL}?action=parse&page=${title}&format=json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: WikiContent = await response.json();
    if (data.parse && data.parse.text) { // Check if the expected properties are present
      let content = data.parse.text["*"]; 

      // Adjust relative URLs to be fully qualified URLs
      content = content.replace(/src="\/images\//g, `src="${BASE_URL}images/`); // Replace src="/images/ with src="https://sustainabilitymethods.org/images/
      content = content.replace(
        /srcset="\/images\//g, 
        `srcset="${BASE_URL}images/` // Replace srcset="/images/ with srcset="https://sustainabilitymethods.org/images/
      );

      return content;
    } else {
      throw new Error("Unexpected response structure. Check if the wiki page exists."); 
    }
  } catch (error) {
    console.error("Error fetching page content:", error); 
    throw error; // Re-throw the error to be caught by the calling function
  }
};


// EXPLANATION
// The fetchPageContent function fetches the content of a wiki page using the MediaWiki API.
// 1. Check for data.parse and data.parse.text: Before accessing data.parse.text["*"], the code checks if data.parse and data.parse.text are defined.
// 2. Error Handling: If data.parse or data.parse.text is not defined, an error is thrown with the message "Unexpected response structure".
// 3. Adjust Relative URLs: The code adjusts relative URLs to be fully qualified URLs, ensuring that images and other resources are correctly linked.
// This modification ensures that the code handles cases where the response structure is not as expected, preventing runtime errors.

