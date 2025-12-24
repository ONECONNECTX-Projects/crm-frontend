"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
    return row[rowKey as keyof T] as string | number || index;
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-50 hover:to-gray-100">
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="font-semibold text-gray-700"
                  >
                    {column.label}
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className="w-12"></TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (actions ? 1 : 0)}
                    className="text-center py-12 text-gray-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={getRowKey(row, index)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {visibleColumns.map((column) => (
                      <TableCell key={column.key} className="text-gray-700">
                        {column.render
                          ? column.render(row)
                          : (row[column.key as keyof T] as React.ReactNode)}
                      </TableCell>
                    ))}

                    {actions && actions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
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
      </CardContent>
    </Card>
  );
}