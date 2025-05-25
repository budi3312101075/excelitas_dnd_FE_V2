import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

const Layout = (props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className={`grow px-4 sm:px-6 lg:px-8 py-6 ${props.className}`}>
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
