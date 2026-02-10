import Link from "next/link";
import Links from "./links/links";
import styles from "./navbar.module.css";

const Navbar = async () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Methods·Wiki
        </Link>
        <Links />
      </div>
    </nav>
  );
};

export default Navbar;
