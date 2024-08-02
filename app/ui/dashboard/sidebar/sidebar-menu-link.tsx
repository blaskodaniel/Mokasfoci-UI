"use client";

import { ReactNode } from "react";
import { Menulink } from "./sidebar.style";
import { usePathname } from "next/navigation";

const MenuLink = ({
  menu,
}: {
  menu: { title: string; path: string; icon: ReactNode };
}) => {
  const pathname = usePathname();
  const isActiveLink = pathname === menu.path;
  return (
    <Menulink href={menu.path} isactive={isActiveLink.toString()}>
      {menu.icon}
      {menu.title}
    </Menulink>
  );
};

export default MenuLink;
