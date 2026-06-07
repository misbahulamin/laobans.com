import { motion } from "framer-motion";
import { HiChartBar, HiDocumentReport, HiTrendingUp } from "react-icons/hi";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

const reportTypes = [
  {
    title: "Aging Report",
    description: "View payment and status aging analysis",
    icon: HiDocumentReport,
    path: "/dashboard/reports/aging",
  },
  {
    title: "Performance Report",
    description: "Track supplier and shipment performance",
    icon: HiTrendingUp,
    path: "/dashboard/reports/performance",
  },
];

export default function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and view business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <report.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <Link to={report.path}>
                      <Button variant="ghost" size="sm" className="mt-3 -ml-2">View Report</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <HiChartBar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a report type to view analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
