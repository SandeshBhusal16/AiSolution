"use client";

import { useMemo, useState } from "react";
import { Eye, Loader2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { STATUSES, type Status } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

/** Minimum shape every managed customer record shares. */
export interface ManagedRecord {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  country: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Column<T> {
  header: string;
  cell: (record: T) => React.ReactNode;
  className?: string;
}

export interface DetailField<T> {
  label: string;
  value: (record: T) => React.ReactNode;
}

export interface TypeFilter<T> {
  label: string;
  field: keyof T;
  options: string[];
}

interface RecordsManagerProps<T extends ManagedRecord> {
  initialRecords: T[];
  resourcePath: string; // e.g. "/api/inquiries"
  entityLabel: string; // singular, e.g. "inquiry"
  entityLabelPlural?: string; // e.g. "inquiries"
  columns: Column<T>[];
  detailFields: DetailField<T>[];
  searchKeys: (keyof T)[];
  typeFilter?: TypeFilter<T>;
  searchPlaceholder?: string;
}

export function RecordsManager<T extends ManagedRecord>({
  initialRecords,
  resourcePath,
  entityLabel,
  entityLabelPlural,
  columns,
  detailFields,
  searchKeys,
  typeFilter,
  searchPlaceholder = "Search by name, email, company or country…",
}: RecordsManagerProps<T>) {
  const pluralLabel = entityLabelPlural ?? `${entityLabel}s`;
  const { toast } = useToast();
  const [records, setRecords] = useState<T[]>(initialRecords);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeValue, setTypeValue] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [recordToView, setRecordToView] = useState<T | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery =
        !q ||
        searchKeys.some((key) =>
          String(record[key] ?? "").toLowerCase().includes(q),
        );
      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;
      const matchesType =
        !typeFilter ||
        typeValue === "all" ||
        String(record[typeFilter.field] ?? "") === typeValue;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [records, query, statusFilter, typeValue, searchKeys, typeFilter]);

  async function handleStatusChange(record: T, status: Status) {
    setUpdatingId(record.id);
    try {
      const res = await fetch(`${resourcePath}/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === record.id
              ? { ...r, status, updatedAt: new Date().toISOString() }
              : r,
          ),
        );
        toast({
          variant: "success",
          title: "Status updated",
          description: `Marked as “${status}”.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: data.message ?? "Could not update the status.",
        });
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDelete() {
    if (!recordToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${resourcePath}/${recordToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
        toast({
          variant: "success",
          title: "Deleted",
          description: `The ${entityLabel} has been removed.`,
        });
        setRecordToDelete(null);
      } else {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: data.message ?? "Could not delete the record.",
        });
      }
    } finally {
      setDeleting(false);
    }
  }

  const colSpan = columns.length + 2;
  const hasRecords = records.length > 0;

  return (
    <div className="space-y-4">
      {/* Toolbar: search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Search records"
          />
        </div>

        {typeFilter && (
          <Select value={typeValue} onValueChange={setTypeValue}>
            <SelectTrigger className="sm:w-56" aria-label={typeFilter.label}>
              <SelectValue placeholder={typeFilter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {typeFilter.label}</SelectItem>
              {typeFilter.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-44" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
        of {records.length} {records.length === 1 ? entityLabel : pluralLabel}
      </p>

      {/* Table */}
      <div className="rounded-2xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.header}>{col.header}</TableHead>
              ))}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {hasRecords
                    ? "No records match your search or filters."
                    : `No ${pluralLabel} yet. New submissions will appear here.`}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((record) => (
                <TableRow key={record.id}>
                  {columns.map((col) => (
                    <TableCell key={col.header} className={col.className}>
                      {col.cell(record)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Select
                      value={record.status}
                      onValueChange={(value) =>
                        handleStatusChange(record, value as Status)
                      }
                      disabled={updatingId === record.id}
                    >
                      <SelectTrigger className="h-8 w-[140px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setRecordToView(record)}
                        aria-label="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-destructive"
                        onClick={() => setRecordToDelete(record)}
                        aria-label="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View details dialog */}
      <Dialog
        open={!!recordToView}
        onOpenChange={(open) => !open && setRecordToView(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{recordToView?.fullName}</DialogTitle>
            <DialogDescription>
              Submitted {formatDateTime(recordToView?.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {recordToView && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  Status:
                </span>
                <StatusBadge status={recordToView.status} />
              </div>
              <dl className="divide-y rounded-lg border">
                {detailFields.map((field) => (
                  <div
                    key={field.label}
                    className="grid grid-cols-3 gap-2 px-3 py-2"
                  >
                    <dt className="font-medium text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="col-span-2 break-words">
                      {field.value(recordToView) || "—"}
                    </dd>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2 px-3 py-2">
                  <dt className="font-medium text-muted-foreground">
                    Last updated
                  </dt>
                  <dd className="col-span-2">
                    {formatDateTime(recordToView.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!recordToDelete}
        onOpenChange={(open) => !open && setRecordToDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this {entityLabel}?</DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {recordToDelete?.fullName}
              </span>
              &apos;s record. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRecordToDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
