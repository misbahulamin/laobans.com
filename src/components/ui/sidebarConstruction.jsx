import { HiHome, HiDocumentReport, HiCog, HiBell } from "react-icons/hi";
import { FaShip, FaBoxOpen, FaFileInvoice, FaMapMarkedAlt, FaClipboardList, FaReceipt } from "react-icons/fa";

export const visibleMenuUrls = new Set([
  "/dashboard/overview",
  "/dashboard/shipments",
  "/dashboard/suppliers",
  "/dashboard/quotes",
  "/dashboard/tracking",
  "/dashboard/reports",
  "/dashboard/notifications",
  "/dashboard/settings",
  "/product-invoice",
]);

export const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: HiHome,
    path: "/dashboard/overview",
  },
  {
    id: "product-invoice",
    label: "Product & Invoice",
    icon: FaReceipt,
    path: "/product-invoice",
  },
  {
    id: "shipments",
    label: "Shipments",
    icon: FaShip,
    path: "/dashboard/shipments",
    children: [
      { id: "shipments-list", label: "All Shipments", path: "/dashboard/shipments" },
      { id: "shipments-new", label: "New Shipment", path: "/dashboard/shipments/new" },
      { id: "shipments-tracking", label: "Track Shipment", path: "/dashboard/tracking" },
    ],
  },
  {
    id: "suppliers",
    label: "Suppliers",
    icon: FaBoxOpen,
    path: "/dashboard/suppliers",
  },
  {
    id: "quotes",
    label: "Quotes",
    icon: FaFileInvoice,
    path: "/dashboard/quotes",
    children: [
      { id: "quotes-list", label: "All Quotes", path: "/dashboard/quotes" },
      { id: "quotes-pending", label: "Pending Approval", path: "/dashboard/quotes?status=pending" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: HiDocumentReport,
    path: "/dashboard/reports",
    children: [
      { id: "reports-aging", label: "Aging Report", path: "/dashboard/reports/aging" },
      { id: "reports-performance", label: "Performance", path: "/dashboard/reports/performance" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: HiBell,
    path: "/dashboard/notifications",
    badge: true,
  },
  {
    id: "settings",
    label: "Settings",
    icon: HiCog,
    path: "/dashboard/settings",
  },
];

export function filterMenuItems(items, visibleUrls) {
  return items
    .filter((item) => visibleUrls.has(item.path) || item.children?.some((child) => visibleUrls.has(child.path)))
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuItems(item.children, visibleUrls) : undefined,
    }));
}
