import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useSupplier } from "../../hook/useSupplier";
import { useUser } from "../../context/UserContext";
import { formatDate } from "../../lib/utils";

export default function SupplierDetail() {
  const { id } = useParams();
  const { getToken } = useUser();
  const { data: supplier, loading, error, refetch } = useSupplier(getToken(), id);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
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

  if (!supplier) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Supplier not found</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <HiArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">{supplier.name}</h1>
          <p className="text-muted-foreground mt-1">Supplier since {formatDate(supplier.created_at)}</p>
        </div>
        <Badge variant={supplier.is_active ? "success" : "danger"} className="ml-auto">
          {supplier.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{supplier.email || "N/A"}</p></div>
            <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{supplier.phone || "N/A"}</p></div>
            <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{supplier.address || "N/A"}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-sm text-muted-foreground">Country</p><p className="font-medium">{supplier.country || "N/A"}</p></div>
            <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{supplier.category || "N/A"}</p></div>
            <div><p className="text-sm text-muted-foreground">Rating</p><p className="font-medium">{supplier.rating ? `${supplier.rating}/5` : "N/A"}</p></div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
