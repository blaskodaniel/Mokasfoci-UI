import { Toaster } from "@/components/ui/toaster";
import { Layout, LayoutContent, LayoutMenu } from "@ui/dashboard/layout.style";
import Navbar from "@ui/dashboard/navbar/navbar";
import Sidebar from "@ui/dashboard/sidebar/sidebar";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout>
      <LayoutMenu>
        <Sidebar />
      </LayoutMenu>
      <LayoutContent>
        <Navbar />
        {children}
        <Toaster />
      </LayoutContent>
    </Layout>
  );
};

export default DashboardLayout;
