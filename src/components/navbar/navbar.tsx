import Link from "next/link";
import Links from "./links/links";
import styles from "./navbar.module.css";

const Navbar = async () => {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Methods Wiki — go to homepage">
          Methods·Wiki
        </Link>
        <Links />
      </div>
    </nav>
  );
};

export default Navbar;
