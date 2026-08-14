"use client";

import { Toaster } from "@/components/ui/toaster";
import { Layout, LayoutContent, LayoutMenu } from "@ui/dashboard/layout.style";
import Navbar from "@ui/dashboard/navbar/navbar";
import Sidebar from "@ui/dashboard/sidebar/sidebar";
import { ReactNode, useState } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState("false");
  return (
    <div className={Layout}>
      <aside
        className={`${LayoutMenu} ${isOpenSidebar === "true" ? "max-[800px]:w-[var(--sidebar-width)] max-[800px]:px-5" : "max-[800px]:w-0 max-[800px]:px-0"}`}
      >
        <Sidebar setIsOpenSidebar={setIsOpenSidebar} />
      </aside>
      <main className={LayoutContent}>
        <Navbar setIsOpenSidebar={setIsOpenSidebar} />
        {children}
        <Toaster />
      </main>
    </div>
  );
};

export default DashboardLayout;
