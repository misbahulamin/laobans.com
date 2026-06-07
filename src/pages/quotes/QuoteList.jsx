import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPlus, HiSearch } from "react-icons/hi";
import { FaFileInvoice } from "react-icons/fa";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { useQuoteList } from "../../hook/useQuote";
import { useUser } from "../../context/UserContext";
import { formatDate, formatCurrency } from "../../lib/utils";

const statusVariants = {
  draft: "outline",
  pending: "warning",
  approved: "success",
  rejected: "danger",
  expired: "danger",
};

export default function QuoteList() {
  const { getToken } = useUser();
  const token = getToken();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, error, pagination, refetch } = useQuoteList(token, { page, search });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Quotes</h1>
          <p className="text-muted-foreground mt-1">Manage procurement quotes</p>
        </div>
        <Button>
          <HiPlus className="w-4 h-4" />
          New Quote
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search quotes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="flex gap-4"><Skeleton className="h-12 w-full" /></div>)}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive mb-2">{error}</p>
              <Button variant="outline" onClick={refetch}>Retry</Button>
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center">
              <FaFileInvoice className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No quotes found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-mono text-sm">{quote.quote_number || quote.id}</TableCell>
                    <TableCell>{quote.supplier_name || "N/A"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(quote.total_amount)}</TableCell>
                    <TableCell><Badge variant={statusVariants[quote.status] || "outline"}>{quote.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(quote.valid_until)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/dashboard/quotes/${quote.id}`}><Button variant="ghost" size="sm">View</Button></Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {pagination.count > 0 && (
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, pagination.count)} of {pagination.count}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!pagination.previous} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={!pagination.next} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
