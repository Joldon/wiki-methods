"use client";

import NavLink from "./navLink/navLink";
import styles from "./links.module.css";
import { useState } from "react";

// temporary
const session = true;
const isAdmin = true;

const links = [
  { title: "Homepage", path: "/" },
  { title: "Methods Wiki", path: "/wiki" },
  { title: "Landscapes", path: "/landscapes" },
  { title: "Recommender Tool", path: "/starter-package" },
];
const Links = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={styles.container}>
      <button
        className={`${styles.menuToggle} ${isOpen ? styles.menuToggleOpen : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span className={styles.menuBar}></span>
        <span className={styles.menuBar}></span>
        <span className={styles.menuBar}></span>
      </button>
      <div className={`${styles.links} ${isOpen ? styles.linksOpen : ""}`}>
        {links.map((link) => (
          <NavLink
            item={link}
            key={link.title}
            onClick={() => setIsOpen(false)}
          />
        ))}
        {session ? (
          <>
            {isAdmin && (
              <NavLink
                item={{ title: "Admin", path: "/admin" }}
                onClick={() => setIsOpen(false)}
              />
            )}
            <button
              className={styles.signInButton}
              onClick={() => setIsOpen(false)}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className={styles.signInButton}
            onClick={() => setIsOpen(false)}
          ></button>
        )}
      </div>
    </div>
  );
};

export default Links;
