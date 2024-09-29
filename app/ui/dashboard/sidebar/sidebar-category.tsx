"use client";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Category, List } from "./sidebar.style";
import MenuLink from "./sidebar-menu-link";
import { SideBarElement } from "./sidebar-types";
import { useState } from "react";

const SideBarCategory = ({ menuItem }: { menuItem: SideBarElement }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li key={menuItem.category?.title}>
      {menuItem.category && (
        <Category onClick={() => setIsOpen(!isOpen)}>
          <div>
            {menuItem.category?.icon}
            {menuItem.category?.title}
          </div>

          <div>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
        </Category>
      )}
      <List isopen={isOpen} elemtsCount={menuItem.list.length}>
        {menuItem.list.map((submenu) => {
          return <MenuLink key={submenu.title} menu={submenu} />;
        })}
      </List>
    </li>
  );
};

export default SideBarCategory;
