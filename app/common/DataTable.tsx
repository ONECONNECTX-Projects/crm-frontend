"use client";

import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto -mx-0.5 sm:mx-0">
          <Table className="min-w-[600px] sm:min-w-full">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-50 hover:to-gray-100">
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                  >
                    {column.label}
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className="w-10 sm:w-12"></TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (actions ? 1 : 0)}
                    className="text-center py-8 sm:py-12 text-gray-500 text-sm"
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
                      <TableCell
                        key={column.key}
                        className="text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3"
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
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
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
