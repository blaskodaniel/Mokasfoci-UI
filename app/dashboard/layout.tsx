import Navbar from "@ui/dashboard/navbar/navbar";
import Sidebar from "@ui/dashboard/sidebar/sidebar";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <div>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
