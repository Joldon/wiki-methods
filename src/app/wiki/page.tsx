// src/app/page.tsx
import Link from "next/link";
import { fetchAllEntries } from "@/lib/fetchData";
import { WikiEntry } from "@/lib/types";
import styles from "./wikis.module.css";
import Image from "next/image";

export default async function WikisPage() {
  const pages: WikiEntry[] = await fetchAllEntries();
  return (
    <div className={styles.container}>
      <h1>Wiki Pages</h1>
      <div className={styles["card-grid"]}>
        {pages.length > 0 ? (
          pages.map((page) => (
            <Link
              key={page.pageid}
              href={`/wiki/${encodeURIComponent(
                page.title.replace(/ /g, "_")
              )}`}
            >
              <div className={styles.card}>
                <Image
                  src="/chart.png"
                  alt={page.title}
                  width={80}
                  height={80}
                />
                <h3>{page.title}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p>No wiki entries found.</p>
        )}
      </div>
    </div>
  );
}
