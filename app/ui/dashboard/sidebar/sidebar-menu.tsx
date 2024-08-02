import { BiNetworkChart } from "react-icons/bi";
import { GiSoccerField, GiSoccerKick } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiDashboard2Line, RiTeamLine } from "react-icons/ri";

export const SideBarMenu = [
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
    title: "Game",
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
    title: "Configs",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <IoSettingsOutline />,
      },
    ],
  },
  {
    title: "Analytics",
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
