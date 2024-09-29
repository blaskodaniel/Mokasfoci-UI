"use client";

import { usePathname } from "next/navigation";
import { Container, Menu, Title } from "./navbar.style";
import { MdLogout } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { Dispatch, SetStateAction } from "react";
import { IconInMobile } from "../sidebar/sidebar.style";

const Navbar = ({
  setIsOpenSidebar,
}: {
  setIsOpenSidebar: Dispatch<SetStateAction<string>>;
}) => {
  const pathname = usePathname();
  return (
    <Container>
      <div>
        <IconInMobile>
          <IoIosMenu size={30} onClick={() => setIsOpenSidebar("true")} />
        </IconInMobile>
        <Title>{pathname.split("/").pop()}</Title>
      </div>

      <Menu>
        {/* <button>
          <MdLogout size={20} /> Logout
        </button> */}
      </Menu>
    </Container>
  );
};

export default Navbar;
