"use client";

import { useState } from "react";
import NavLink from "./navLink/navLink";
import styles from "./links.module.css";

const NAV_LINKS = [
  { title: "Home", path: "/" },
  { title: "Methods Wiki", path: "/wiki" },
  { title: "Landscapes", path: "/landscapes" },
  { title: "Recommender Tool", path: "/starter-package" },
  { title: "Posts", path: "/posts" },
];

const Links = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.menuToggle} ${isOpen ? styles.menuToggleOpen : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="nav-links"
      >
        <span className={styles.menuBar} aria-hidden="true" />
        <span className={styles.menuBar} aria-hidden="true" />
        <span className={styles.menuBar} aria-hidden="true" />
      </button>

      <div
        id="nav-links"
        className={`${styles.links} ${isOpen ? styles.linksOpen : ""}`}
      >
        {NAV_LINKS.map((link) => (
          <NavLink key={link.path} item={link} onClick={closeMenu} />
        ))}
      </div>
    </div>
  );
};

export default Links;
