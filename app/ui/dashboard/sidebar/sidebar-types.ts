import type { ReactElement } from "react";

export type SideBarElement = {
  category: SideBarCategory;
  list: SideBarListElemet[];
};

export type SideBarCategory = {
  title: string;
  icon: ReactElement;
  path?: string;
};

export type SideBarListElemet = {
  title: string;
  path: string;
  icon: ReactElement;
};
