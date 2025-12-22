import Link from "next/link";
import styles from "./hero.module.css";
import Button from "../buttons/button";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <span className={styles.heroTag}>Knowledge Base</span>
      <h1 className={styles.heroTitle}>Reserch Methods, Simplified</h1>
      <p className={styles.heroSubheading}>
        A curated collection of research methodologies for social sciences
      </p>
      <div className={styles.heroCta}>
        <Link href="/wiki">
          <Button
            defaultText="Start Exploring"
            loadingText="Loading..."
            variant="primary"
            className={styles.btnExplore}
          />
        </Link>
      </div>
      <div className={styles.heroIllustration}>
        <svg
          className={styles.connectionLines}
          viewBox="0 0 600 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Left dot */}
          <circle cx="100" cy="50" r="4" fill="currentColor" opacity="0.3" />

          {/* Line 1 */}
          <line
            x1="104"
            y1="50"
            x2="184"
            y2="50"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Center-left dot */}
          <circle cx="184" cy="50" r="4" fill="currentColor" opacity="0.3" />

          {/* Line 2 */}
          <line
            x1="188"
            y1="50"
            x2="268"
            y2="50"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Center dot (larger) */}
          <circle cx="268" cy="50" r="6" fill="currentColor" opacity="0.4" />

          {/* Line 3 */}
          <line
            x1="274"
            y1="50"
            x2="354"
            y2="50"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Center-right dot */}
          <circle cx="354" cy="50" r="4" fill="currentColor" opacity="0.3" />

          {/* Line 4 */}
          <line
            x1="358"
            y1="50"
            x2="438"
            y2="50"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Right dot */}
          <circle cx="438" cy="50" r="4" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
