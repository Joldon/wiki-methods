// src/lib/fetchData.ts

import { WikiEntry, WikiContent } from "./types";

const API_URL = "https://sustainabilitymethods.org/api.php";

export const fetchAllEntries = async (): Promise<WikiEntry[]> => {
  const response = await fetch(
    `${API_URL}?action=query&list=allpages&format=json&aplimit=max`
  );
  const data = await response.json();
  return data.query.allpages;
};

export const fetchPageContent = async (title: string): Promise<string> => {
  const response = await fetch(
    `${API_URL}?action=parse&page=${title}&format=json`
  );
  const data: WikiContent = await response.json();
  return data.parse.text["*"];
};
