import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/navigation/Sidebar";
import SearchBar from "../components/navigation/SearchBar";
import { Drawer, DrawerContent } from "../components/ui/drawer";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:block" />

      <Drawer direction="left" open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent className="p-0 w-64">
          <Sidebar mobile />
        </DrawerContent>
      </Drawer>

      <div className="flex flex-1 flex-col">
        <SearchBar onMenuClick={() => setMobileOpen(true)} />
        <div className="flex-1 overflow-y-auto p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
