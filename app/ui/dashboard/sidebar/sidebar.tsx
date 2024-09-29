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
    <Container>
      <div>
        <UserInfo>
          <Image src="/avatar.png" alt="avatar" width={50} height={50} />
          <div>
            <UserName>Daniel</UserName>
            <UserRole>Administrator</UserRole>
          </div>
          <IconInMobile>
            <IoIosArrowBack
              size={30}
              onClick={() => setIsOpenSidebar("false")}
            />
          </IconInMobile>
        </UserInfo>
        <ul>
          {SideBarMenuData.map((menu, i) => {
            return <SideBarCategory key={i} menuItem={menu} />;
          })}
        </ul>
      </div>

      <form action={logOut}>
        <LogoutButton>
          <MdLogout size={20} /> Logout
        </LogoutButton>
      </form>
    </Container>
  );
};

export default Sidebar;
