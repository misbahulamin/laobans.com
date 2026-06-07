import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Dashboard from "../pages/dashboards/Dashboard";
import ModuleDashboard from "../pages/dashboards/ModuleDashboard";
import ReportsPage from "../pages/dashboards/ReportsPage";
import ComingSoon from "../pages/ComingSoon";
import AccessDenied from "../pages/AccessDenied";
import NotFound from "../pages/NotFound";
import { PrivateRoute } from "./guards";
import ProductInvoiceGenerator from "../components/ProductInvoiceGenerator";
import InvoiceCalculator from "../pages/InvoiceCalculator";

// Shipment pages
import ShipmentList from "../pages/shipments/ShipmentList";
import ShipmentDetail from "../pages/shipments/ShipmentDetail";
import CreateShipment from "../pages/shipments/CreateShipment";
import ShipmentTracking from "../pages/shipments/ShipmentTracking";

// Supplier pages
import SupplierList from "../pages/suppliers/SupplierList";
import SupplierDetail from "../pages/suppliers/SupplierDetail";

// Quote pages
import QuoteList from "../pages/quotes/QuoteList";
import QuoteDetail from "../pages/quotes/QuoteDetail";

// Notification page
import Notifications from "../pages/Notifications";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      { path: "signin", element: <Signin /> },
      { path: "product-invoice", element: <ProductInvoiceGenerator /> },
      { path: "invoice-calculator", element: <InvoiceCalculator /> },
      { path: "access-denied", element: <AccessDenied /> },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              { index: true, element: <ModuleDashboard /> },
              { path: "overview", element: <ModuleDashboard /> },
              {
                path: "shipments",
                children: [
                  { index: true, element: <ShipmentList /> },
                  { path: ":id", element: <ShipmentDetail /> },
                  { path: "new", element: <CreateShipment /> },
                ],
              },
              {
                path: "suppliers",
                children: [
                  { index: true, element: <SupplierList /> },
                  { path: ":id", element: <SupplierDetail /> },
                ],
              },
              {
                path: "quotes",
                children: [
                  { index: true, element: <QuoteList /> },
                  { path: ":id", element: <QuoteDetail /> },
                ],
              },
              {
                path: "tracking",
                element: <ShipmentTracking />,
              },
              {
                path: "reports",
                children: [
                  { index: true, element: <ReportsPage /> },
                  { path: "aging", element: <ComingSoon title="Aging Report" /> },
                  { path: "performance", element: <ComingSoon title="Performance Report" /> },
                ],
              },
              { path: "notifications", element: <Notifications /> },
              { path: "settings", element: <ComingSoon title="Settings" /> },
            ],
          },
        ],
      },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
