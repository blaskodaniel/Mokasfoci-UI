"use client";

import { Toaster } from "@/components/ui/toaster";
import { Layout, LayoutContent, LayoutMenu } from "@ui/dashboard/layout.style";
import Navbar from "@ui/dashboard/navbar/navbar";
import Sidebar from "@ui/dashboard/sidebar/sidebar";
import { ReactNode, useState } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState("false");
  return (
    <Layout>
      <LayoutMenu isopen={isOpenSidebar}>
        <Sidebar setIsOpenSidebar={setIsOpenSidebar} />
      </LayoutMenu>
      <LayoutContent>
        <Navbar setIsOpenSidebar={setIsOpenSidebar} />
        {children}
        <Toaster />
      </LayoutContent>
    </Layout>
  );
};

export default DashboardLayout;
