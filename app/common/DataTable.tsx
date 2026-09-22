"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export interface TableColumn<T = any> {
  key: string;
  label: string;
  visible?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface TableAction<T = any> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
}

interface DataTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  emptyMessage?: string;
  rowKey?: keyof T | ((row: T) => string | number);
}

export default function DataTable<T = any>({
  columns,
  data,
  actions,
  emptyMessage = "No data available",
  rowKey = "id" as keyof T,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((col) => col.visible !== false);

  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return (row[rowKey as keyof T] as string | number) || index;
  };

  return (
    // The table is the only card on the page.
    <div className="my-2 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Only this box scrolls — page actions above and pagination below stay put.
          ponytail: fixed viewport-based height, make it a prop if a page needs another. */}
      <div className="overflow-auto h-[calc(100vh-260px)]">
          <Table
            containerClassName="overflow-x-visible"
            className="min-w-[600px] sm:min-w-full"
          >
            <TableHeader>
              <TableRow className="border-border bg-muted hover:bg-muted">
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="sticky top-0 z-10 whitespace-nowrap bg-muted px-2 py-3 text-xs font-semibold uppercase tracking-wide text-brand-700 sm:px-4"
                  >
                    {column.label}
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className="sticky top-0 z-10 w-10 bg-muted sm:w-12"></TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (actions ? 1 : 0)}
                    className="text-center py-8 sm:py-12 text-muted-foreground text-sm"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={getRowKey(row, index)}
                    className="border-border transition-colors hover:bg-muted/50"
                  >
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column.key}
                        className="text-foreground text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3"
                      >
                        {column.render
                          ? column.render(row)
                          : (() => {
                              const value = row[column.key as keyof T];
                              return value === null ||
                                value === undefined ||
                                value === ""
                                ? "-"
                                : (value as React.ReactNode);
                            })()}
                      </TableCell>
                    ))}

                    {actions && actions.length > 0 && (
                      <TableCell className="px-1 sm:px-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 rounded-md border border-border bg-card p-0 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className={
                                  action.variant === "destructive"
                                    ? "text-red-600"
                                    : ""
                                }
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}
