import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useQuote } from "../../hook/useQuote";
import { useUser } from "../../context/UserContext";
import { formatDate, formatCurrency } from "../../lib/utils";

export default function QuoteDetail() {
  const { id } = useParams();
  const { getToken } = useUser();
  const { data: quote, loading, error, refetch } = useQuote(getToken(), id);

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

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Quote not found</p>
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
          <h1 className="text-2xl font-heading font-bold text-primary">Quote #{quote.quote_number || id}</h1>
          <p className="text-muted-foreground mt-1">Created {formatDate(quote.created_at)}</p>
        </div>
        <Badge variant={quote.status === "approved" ? "success" : "warning"} className="ml-auto">
          {quote.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Quote Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-sm text-muted-foreground">Supplier</p><p className="font-medium">{quote.supplier_name || "N/A"}</p></div>
            <div><p className="text-sm text-muted-foreground">Total Amount</p><p className="font-medium text-lg">{formatCurrency(quote.total_amount)}</p></div>
            <div><p className="text-sm text-muted-foreground">Valid Until</p><p className="font-medium">{formatDate(quote.valid_until)}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-sm text-muted-foreground">Items</p><p className="font-medium">{quote.items?.length || 0}</p></div>
            <div><p className="text-sm text-muted-foreground">Subtotal</p><p className="font-medium">{formatCurrency(quote.subtotal)}</p></div>
            <div><p className="text-sm text-muted-foreground">Tax</p><p className="font-medium">{formatCurrency(quote.tax)}</p></div>
            <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Total</p><p className="font-bold text-lg">{formatCurrency(quote.total_amount)}</p></div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
