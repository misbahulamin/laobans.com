import { Outlet } from "react-router";
import Sidebar from "../../components/layout/Sidebar";
import TopBar from "../../components/layout/TopBar";
import { useUser } from "../../context/UserContext";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={user} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar user={user} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-custom">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
