import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPlus, HiSearch, HiFilter } from "react-icons/hi";
import { FaShip } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { useShipmentList } from "../../hook/useShipment";
import { useUser } from "../../context/UserContext";
import { formatDate } from "../../lib/utils";

const statusVariants = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  in_transit: "info",
  customs: "warning",
  delivered: "success",
  cancelled: "danger",
};

export default function ShipmentList() {
  const { getToken } = useUser();
  const token = getToken();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { data, loading, error, pagination, refetch, fetch } = useShipmentList(token, {
    page,
    search,
    status: statusFilter,
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetch({ search, page, status: statusFilter });
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, statusFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Shipments</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your shipments</p>
        </div>
        <Link to="/dashboard/shipments/new">
          <Button>
            <HiPlus className="w-4 h-4" />
            New Shipment
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by tracking number, origin, destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="customs">Customs</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-24" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive mb-2">{error}</p>
              <Button variant="outline" onClick={refetch}>
                Retry
              </Button>
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center">
              <FaShip className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No shipments found</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first shipment to get started</p>
              <Link to="/dashboard/shipments/new" className="mt-4 inline-block">
                <Button size="sm">
                  <HiPlus className="w-4 h-4 mr-2" />
                  New Shipment
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-mono text-sm">{shipment.tracking_number || "N/A"}</TableCell>
                    <TableCell>
                      {shipment.origin} → {shipment.destination}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[shipment.status] || "default"}>
                        {shipment.status?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{shipment.carrier || "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(shipment.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/dashboard/shipments/${shipment.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {pagination.count > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, pagination.count)} of {pagination.count} results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!pagination.previous} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!pagination.next} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
