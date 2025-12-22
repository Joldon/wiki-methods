import styles from "./valueProposition.module.css";

const ValueProposition = () => {
  return (
    <section className={styles.valueProposition}>
      <div className={styles.valueCards}>
        {/* card 1: learn */}
        <div className={styles.valueCard}>
          <div className={styles.iconWrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.valueIcon}
              aria-hidden="true"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Learn</h3>
          <p className={styles.cardDescription}>
            Comprehensive guides to research methods
          </p>
        </div>

        {/* card 2: discover */}
        <div className={styles.valueCard}>
          <div className={styles.iconWrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.valueIcon}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Discover</h3>
          <p className={styles.cardDescription}>
            Explore connections through interactive visualizations
          </p>
        </div>

        {/* card 3: contribute */}
        <div className={styles.valueCard}>
          <div className={styles.iconWrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.valueIcon}
              aria-hidden="true"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Contribute</h3>
          <p className={styles.cardDescription}>
            Share experiences and build collective knowledge
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
