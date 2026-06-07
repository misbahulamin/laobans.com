import { Outlet } from "react-router";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useUser } from "../../context/UserContext";

export default function PageShell() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={user} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-custom">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
