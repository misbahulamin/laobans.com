import { motion } from "framer-motion";
import { HiChartBar, HiTrendingUp, HiTruck, HiCurrencyDollar } from "react-icons/hi";
import { FaShip, FaBoxOpen, FaFileInvoice } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const stats = [
  { label: "Active Shipments", value: "24", change: "+12%", icon: FaShip, color: "text-primary" },
  { label: "Suppliers", value: "156", change: "+8%", icon: FaBoxOpen, color: "text-secondary" },
  { label: "Pending Quotes", value: "42", change: "-5%", icon: FaFileInvoice, color: "text-warning" },
  { label: "This Month's Spend", value: "$125K", change: "+18%", icon: HiCurrencyDollar, color: "text-success" },
];

const recentShipments = [
  { id: 1, tracking: "SHP-2024-001", origin: "Shanghai", destination: "Los Angeles", status: "in_transit" },
  { id: 2, tracking: "SHP-2024-002", origin: "Rotterdam", destination: "New York", status: "delivered" },
  { id: 3, tracking: "SHP-2024-003", origin: "Dubai", destination: "Singapore", status: "processing" },
];

const statusVariants = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  in_transit: "info",
  delivered: "success",
  cancelled: "danger",
};

export default function ModuleDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your shipping and sourcing operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <Badge variant={stat.change.startsWith("+") ? "success" : "danger"} className="mt-2 text-xs">
                      {stat.change} vs last month
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Shipments</CardTitle>
            <Link to="/dashboard/shipments">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-mono text-sm">{shipment.tracking}</p>
                    <p className="text-xs text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
                  </div>
                  <Badge variant={statusVariants[shipment.status]} className="capitalize">
                    {shipment.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/dashboard/shipments/new">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <FaShip className="w-5 h-5" />
                  <span className="text-xs">New Shipment</span>
                </Button>
              </Link>
              <Link to="/dashboard/tracking">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <HiTruck className="w-5 h-5" />
                  <span className="text-xs">Track Shipment</span>
                </Button>
              </Link>
              <Link to="/dashboard/quotes">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <FaFileInvoice className="w-5 h-5" />
                  <span className="text-xs">New Quote</span>
                </Button>
              </Link>
              <Link to="/dashboard/reports">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <HiChartBar className="w-5 h-5" />
                  <span className="text-xs">View Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <HiTrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Charts will be displayed here</p>
              <p className="text-sm">Connect your data source to see analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
