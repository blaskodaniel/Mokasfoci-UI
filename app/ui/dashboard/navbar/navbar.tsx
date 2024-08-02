"use client";

import { usePathname } from "next/navigation";
import { Container, Menu, Title } from "./navbar.style";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <Container>
      <Title>{pathname.split("/").pop()}</Title>
      <Menu>
        <button>
          <MdLogout size={20} /> Logout
        </button>
      </Menu>
    </Container>
  );
};

export default Navbar;
