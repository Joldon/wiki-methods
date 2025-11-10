// Comparison page for all prototypes
import Link from "next/link";
import styles from "./designs.module.css";

export default function DesignsComparison() {
  return (
    <main className={styles.main}>
      <h1>Design Prototypes Comparison</h1>
      <ul className={styles.list}>
        <li>
          <Link href="/designs/v1">Visual Immersive</Link>
        </li>
        <li>
          <Link href="/designs/v2">Balanced Academic</Link>
        </li>
        <li>
          <Link href="/designs/v3">Clean Minimalist</Link>
        </li>
      </ul>
      <p>Share these links with colleagues for quick feedback.</p>
    </main>
  );
}
