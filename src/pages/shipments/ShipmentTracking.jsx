import { useState } from "react";
import { motion } from "framer-motion";
import { HiSearch, HiLocationMarker } from "react-icons/hi";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { TimelineIndicator } from "../../components/ui/TimelineIndicator";
import { useShipmentTracking } from "../../hook/useShipment";
import { useUser } from "../../context/UserContext";

export default function ShipmentTracking() {
  const { getToken } = useUser();
  const token = getToken();
  const [trackingNumber, setTrackingNumber] = useState("");
  const { data, loading, error, track } = useShipmentTracking(token);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      track(trackingNumber.trim());
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary">Track Shipment</h1>
        <p className="text-muted-foreground mt-1">Enter a tracking number to see shipment status</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Enter tracking number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" isLoading={loading}>
              Track
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-2">Shipment not found</p>
            <p className="text-sm text-muted-foreground">Please check the tracking number and try again</p>
          </CardContent>
        </Card>
      )}

      {data && !loading && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Badge variant="info" className="mb-2">{data.tracking_number}</Badge>
                  <h2 className="text-lg font-semibold">Shipment Status</h2>
                </div>
                <Badge variant={data.status === "delivered" ? "success" : "info"} className="text-sm">
                  {data.status?.replace("_", " ")}
                </Badge>
              </div>
              <TimelineIndicator stages={[]} currentStage={data.status} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <HiLocationMarker className="w-5 h-5" />
                  Route Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-medium">{data.origin || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium">{data.destination || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Location</p>
                    <p className="font-medium">{data.current_location || "In Transit"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Shipment Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Carrier</p>
                    <p className="font-medium">{data.carrier || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{data.weight ? `${data.weight} kg` : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{data.estimated_delivery || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
}
