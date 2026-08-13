import Image from "next/image";
import {
  Container,
  IconInMobile,
  LogoutButton,
  UserInfo,
  UserName,
  UserRole,
} from "./sidebar.style";
import { MdLogout } from "react-icons/md";
import { SideBarMenuData } from "./sidebar-menu-data";
import SideBarCategory from "./sidebar-category";
import { logOut } from "services/actions";
import { Dispatch, SetStateAction } from "react";
import { IoIosArrowBack } from "react-icons/io";

const Sidebar = ({
  setIsOpenSidebar,
}: {
  setIsOpenSidebar: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className={Container}>
      <div>
        <div className={UserInfo}>
          <Image src="/avatar.png" alt="avatar" width={50} height={50} />
          <div>
            <span className={UserName}>Daniel</span>
            <span className={UserRole}>Administrator</span>
          </div>
          <div className={IconInMobile}>
            <IoIosArrowBack
              size={30}
              onClick={() => setIsOpenSidebar("false")}
            />
          </div>
        </div>
        <ul>
          {SideBarMenuData.map((menu, i) => {
            return <SideBarCategory key={i} menuItem={menu} />;
          })}
        </ul>
      </div>

      <form action={logOut}>
        <button className={LogoutButton}>
          <MdLogout size={20} /> Logout
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
