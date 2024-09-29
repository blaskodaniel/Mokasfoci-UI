export type SideBarElement = {
  category?: SideBarCategory;
  list: SideBarListElemet[];
};

export type SideBarCategory = {
  title: string;
  icon: JSX.Element;
};

export type SideBarListElemet = {
  title: string;
  path: string;
  icon: JSX.Element;
};
