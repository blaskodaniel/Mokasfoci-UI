"use client";

import { ReactNode } from "react";
import { Menulink } from "./sidebar.style";
import { usePathname } from "next/navigation";

const MenuLink = ({ menu }: { menu: { title: string; path: string; icon: ReactNode } }) => {
  const pathname = usePathname();
  const isActiveLink = pathname === menu.path;
  return (
    <a className={`${Menulink} ${isActiveLink ? "bg-[#2e374a]" : ""}`} href={menu.path}>
      {menu.icon}
      {menu.title}
    </a>
  );
};

export default MenuLink;
