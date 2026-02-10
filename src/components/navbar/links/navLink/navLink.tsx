"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navLink.module.css";

type NavLinkItem = {
  title: string;
  path: string;
};

type NavLinkProps = {
  item: NavLinkItem;
  onClick?: () => void;
};

const NavLink = ({ item, onClick }: NavLinkProps) => {
  const pathName = usePathname();
  return (
    <Link
      href={item.path}
      className={`${styles.container} ${pathName === item.path ? styles.active : ""}`}
      onClick={onClick}
    >
      {item.title}
    </Link>
  );
};

export default NavLink;
