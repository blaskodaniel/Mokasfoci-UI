"use client";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Category, List } from "./sidebar.style";
import MenuLink from "./sidebar-menu-link";
import { SideBarCategory as SideBarCategoryType, SideBarElement } from "./sidebar-types";
import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const SideBarCategory = ({ menuItem }: { menuItem: SideBarElement }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const isCategoryActive = menuItem.list.some((x) => x.path === pathname);
  const [isOpen, setIsOpen] = useState(isCategoryActive);

  const clickHandler = useCallback(
    (category: SideBarCategoryType) => {
      if (category.path) {
        push(category.path);
      } else {
        setIsOpen(!isOpen);
      }
    },
    [isOpen, push],
  );

  return (
    <li key={menuItem.category?.title}>
      {menuItem.category && (
        <span className={Category} onClick={() => clickHandler(menuItem.category)}>
          <div>
            {menuItem.category?.icon}
            {menuItem.category?.title}
          </div>

          {!menuItem.category?.path && <div>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>}
        </span>
      )}
      <div className={`${List} ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        {menuItem.list.map((submenu) => {
          return <MenuLink key={submenu.title} menu={submenu} />;
        })}
      </div>
    </li>
  );
};

export default SideBarCategory;
