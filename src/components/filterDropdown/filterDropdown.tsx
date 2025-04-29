"use client";

import { useRouter } from "next/navigation";
import styles from "./filterDropdown.module.css";

type WikiArticle = {
  wikiArticle: string | null;
};

type FilterDropdownProps = {
  uniqueWikiArticles: WikiArticle[];
  currentFilter?: string;
};

const FilterDropdown = ({
  uniqueWikiArticles,
  currentFilter,
}: FilterDropdownProps) => {
  const router = useRouter();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      router.push(`/posts?wiki=${encodeURIComponent(value)}`);
    } else {
      router.push("/posts");
    }
  };
  return (
    <div className={styles.filterContainer}>
      <label htmlFor="wikiFilter">Filter by Wiki Article: </label>
      <select
        id="wikiFilter"
        defaultValue={currentFilter || ""}
        onChange={handleFilterChange}
      >
        <option value="">All Articles</option>
        {uniqueWikiArticles
          .filter((item) => item.wikiArticle)
          .map((item) => (
            <option key={item.wikiArticle || ""} value={item.wikiArticle || ""}>
              {item.wikiArticle?.replace(/_/g, " ")}
            </option>
          ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
