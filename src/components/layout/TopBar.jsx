import { HiMenu, HiBell, HiSearch } from "react-icons/hi";
import { NotificationBell } from "../ui/NotificationBell";
import { UserAvatarDropdown } from "../ui/UserAvatarDropdown";
import { useLocation } from "react-router-dom";
import { HiDocumentText } from "react-icons/hi";

const pageTitles = {
  "/dashboard/overview": "Dashboard Overview",
  "/dashboard/shipments": "Shipments",
  "/dashboard/suppliers": "Suppliers",
  "/dashboard/quotes": "Quotes",
  "/dashboard/tracking": "Shipment Tracking",
  "/dashboard/reports": "Reports",
  "/dashboard/notifications": "Notifications",
  "/dashboard/settings": "Settings",
  "/product-invoice": "Product & Invoice Generator",
};

export default function TopBar({ user, onMenuClick }) {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const basePath = "/" + pathParts.slice(1, 3).join("/");
  const title = pageTitles[basePath] || pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-border bg-surface/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <HiMenu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-heading font-semibold text-primary">{title}</h1>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search shipments, suppliers..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden sm:block border-l border-border h-8 mx-2" />
          <UserAvatarDropdown />
        </div>
      </div>
    </header>
  );
}
