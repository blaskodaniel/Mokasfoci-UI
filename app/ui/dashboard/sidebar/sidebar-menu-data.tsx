import { BiNetworkChart } from "react-icons/bi";
import { GiSoccerField, GiSoccerKick } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiDashboard2Line, RiTeamLine } from "react-icons/ri";
import { SideBarElement } from "./sidebar-types";

export const SideBarMenuData: SideBarElement[] = [
  {
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <RiDashboard2Line />,
      },
    ],
  },
  {
    category: {
      title: "Game",
      icon: <BiNetworkChart />,
    },
    list: [
      {
        title: "Groups",
        path: "/dashboard/groups",
        icon: <BiNetworkChart />,
      },
      {
        title: "Teams",
        path: "/dashboard/teams",
        icon: <RiTeamLine />,
      },
      {
        title: "Matches",
        path: "/dashboard/matches",
        icon: <GiSoccerField />,
      },
      {
        title: "Players",
        path: "/dashboard/users",
        icon: <GiSoccerKick />,
      },
    ],
  },
  {
    category: {
      title: "Configs",
      icon: <BiNetworkChart />,
    },
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <IoSettingsOutline />,
      },
    ],
  },
  {
    category: {
      title: "Analytics",
      icon: <BiNetworkChart />,
    },
    list: [
      {
        title: "Logs",
        path: "/dashboard/logs",
        icon: <BiNetworkChart />,
      },
      {
        title: "Statistics",
        path: "/dashboard/statistics",
        icon: <BiNetworkChart />,
      },
    ],
  },
];
