import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPlus, HiSearch } from "react-icons/hi";
import { FaBoxOpen } from "react-icons/fa";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { useSupplierList } from "../../hook/useSupplier";
import { useUser } from "../../context/UserContext";
import { formatDate } from "../../lib/utils";

export default function SupplierList() {
  const { getToken } = useUser();
  const token = getToken();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, error, pagination, refetch, fetch } = useSupplierList(token, { page, search });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Suppliers</h1>
          <p className="text-muted-foreground mt-1">Manage your supplier directory</p>
        </div>
        <Button>
          <HiPlus className="w-4 h-4" />
          Add Supplier
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
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
              <FaBoxOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No suppliers found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.country || "N/A"}</TableCell>
                    <TableCell>{supplier.category || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.is_active ? "success" : "danger"}>
                        {supplier.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(supplier.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/dashboard/suppliers/${supplier.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
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
