import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft, HiPrinter, HiDownload, HiLocationMarker } from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { TimelineIndicator } from "../../components/ui/TimelineIndicator";
import { useShipment } from "../../hook/useShipment";
import { useUser } from "../../context/UserContext";
import { formatDate, formatDateTime } from "../../lib/utils";

const statusVariants = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  in_transit: "info",
  customs: "warning",
  delivered: "success",
  cancelled: "danger",
};

export default function ShipmentDetail() {
  const { id } = useParams();
  const { getToken } = useUser();
  const { data: shipment, loading, error, refetch } = useShipment(getToken(), id);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Shipment not found</p>
        <Link to="/dashboard/shipments">
          <Button variant="outline">Back to Shipments</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/shipments">
            <Button variant="ghost" size="icon">
              <HiArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-bold text-primary">
                Shipment #{shipment.tracking_number || id}
              </h1>
              <Badge variant={statusVariants[shipment.status] || "default"}>
                {shipment.status?.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Created {formatDate(shipment.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <HiPrinter className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <HiDownload className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <TimelineIndicator stages={[]} currentStage={shipment.status} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Origin</p>
                <p className="font-medium flex items-center gap-2">
                  <HiLocationMarker className="w-4 h-4 text-secondary" />
                  {shipment.origin || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium flex items-center gap-2">
                  <HiLocationMarker className="w-4 h-4 text-primary" />
                  {shipment.destination || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carrier</p>
                <p className="font-medium">{shipment.carrier || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipping Method</p>
                <p className="font-medium capitalize">{shipment.shipping_method || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium">{shipment.weight ? `${shipment.weight} kg` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Delivery</p>
                <p className="font-medium">{formatDate(shipment.estimated_delivery) || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {shipment.description || "No description provided"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-success mt-2" />
              <div>
                <p className="font-medium">Shipment Created</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(shipment.created_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
