import Image from "next/image";
import { SideBarMenu } from "./sidebar-menu";
import MenuLink from "./sidebar-menu-link";
import {
  Category,
  Container,
  LogoutButton,
  UserInfo,
  UserName,
  UserRole,
} from "./sidebar.style";
import { MdLogout } from "react-icons/md";

const Sidebar = () => {
  return (
    <Container>
      <UserInfo>
        <Image src="/avatar.png" alt="avatar" width={50} height={50} />
        <div>
          <UserName>Daniel</UserName>
          <UserRole>Administrator</UserRole>
        </div>
      </UserInfo>
      <ul>
        {SideBarMenu.map((category) => {
          return (
            <li key={category.title}>
              <Category>{category.title}</Category>
              {category.list.map((menu) => {
                return <MenuLink key={menu.title} menu={menu} />;
              })}
            </li>
          );
        })}
      </ul>
      <LogoutButton>
        <MdLogout size={20} /> Logout
      </LogoutButton>
    </Container>
  );
};

export default Sidebar;
