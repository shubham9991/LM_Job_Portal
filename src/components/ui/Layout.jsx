import { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/SearchBar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(1);

  return (
    <div className="flex h-screen w-full overflow-hidden p-2">
      <Sidebar collapsed={collapsed} active={active} setActive={setActive} />
      <div className="flex flex-col flex-1 bg-gray-50">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto px-6 py-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
