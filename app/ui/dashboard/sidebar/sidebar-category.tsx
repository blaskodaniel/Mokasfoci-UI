"use client";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Category, List } from "./sidebar.style";
import MenuLink from "./sidebar-menu-link";
import {
  SideBarCategory as SideBarCategoryType,
  SideBarElement,
} from "./sidebar-types";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

const SideBarCategory = ({ menuItem }: { menuItem: SideBarElement }) => {
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = useCallback(
    (category: SideBarCategoryType) => {
      if (category.path) {
        push(category.path);
      } else {
        setIsOpen(!isOpen);
      }
    },
    [isOpen, push]
  );

  return (
    <li key={menuItem.category?.title}>
      {menuItem.category && (
        <Category onClick={() => clickHandler(menuItem.category)}>
          <div>
            {menuItem.category?.icon}
            {menuItem.category?.title}
          </div>

          {!menuItem.category?.path && (
            <div>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
          )}
        </Category>
      )}
      <List isopen={isOpen.toString()} elemtscount={menuItem.list.length}>
        {menuItem.list.map((submenu) => {
          return <MenuLink key={submenu.title} menu={submenu} />;
        })}
      </List>
    </li>
  );
};

export default SideBarCategory;
