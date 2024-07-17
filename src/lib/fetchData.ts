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

export const fetchPageContent = async (title: string): Promise<string> => {
  const response = await fetch(
    `${API_URL}?action=parse&page=${title}&format=json`
  );
  const data: WikiContent = await response.json();
  return data.parse.text["*"];
};

// export const fetchPageContent = async (title: string): Promise<string> => {
//   try {
//     const response = await fetch(
//       `${API_URL}?action=parse&page=${title}&format=json`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data: WikiContent = await response.json();
//     let content = data.parse.text["*"];

//     // Adjust relative URLs to be fully qualified URLs
//     content = content.replace(/src="\/images\//g, `src="${BASE_URL}images/`);
//     content = content.replace(
//       /srcset="\/images\//g,
//       `srcset="${BASE_URL}images/`
//     );

//     return content;
//   } catch (error) {
//     console.error("Error fetching page content:", error);
//     throw error; // Re-throw the error to be caught by the calling function
//   }
// };
