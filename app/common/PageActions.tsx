"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Filter, Printer, Download, Columns, Search, Plus } from "lucide-react";
import InputField from "@/app/common/InputFeild";

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface PageActionsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showFilter?: boolean;
  onFilterClick?: () => void;
  showColumns?: boolean;
  columns?: Column[];
  onColumnToggle?: (key: string) => void;
  showExport?: boolean;
  onPrintPDF?: () => void;
  onDownloadExcel?: () => void;
  createButtonText?: string;
  onCreateClick?: () => void;
  showCreateButton?: boolean;
}

export default function PageActions({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showFilter = true,
  onFilterClick,
  showColumns = true,
  columns = [],
  onColumnToggle,
  showExport = true,
  onPrintPDF,
  onDownloadExcel,
  createButtonText = "Create",
  onCreateClick,
  showCreateButton = true,
}: PageActionsProps) {
  return (
    // A band inside the page card, not a card of its own — nesting cards three
    // deep is what made every list page look like stacked panels.
    <div className="flex flex-col gap-4 border-b border-border py-4 md:flex-row md:items-center md:justify-between">
      {/* LEFT SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
        {/* SEARCH BOX */}
        <div className="w-full sm:w-64 md:w-72">
          <InputField
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange(e)}
            value={searchValue}
            icon={<Search className="size-4" />}
          />
        </div>

        {/* FILTER BUTTON */}
        {/* {showFilter && (
          <Button
            variant="outline"
            className="flex w-full gap-2 rounded-lg border border-border bg-card text-foreground shadow-none transition-colors hover:bg-muted sm:w-auto"
            onClick={onFilterClick}
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        )} */}

        {/* COLUMNS DROPDOWN */}
        {showColumns && columns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex w-full gap-2 rounded-lg border border-border bg-card text-foreground shadow-none transition-colors hover:bg-muted sm:w-auto"
              >
                <Columns className="w-4 h-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={column.visible}
                  onCheckedChange={() => onColumnToggle?.(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* RIGHT SECTION (Export + Create) */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        {showExport && (
          <>
            <Button
              variant="outline"
              className="flex w-full gap-2 rounded-lg border border-border bg-card text-foreground shadow-none transition-colors hover:bg-muted sm:w-auto"
              onClick={onPrintPDF}
            >
              <Printer className="w-4 h-4" />
              Print PDF
            </Button>

            <Button
              variant="outline"
              className="flex w-full gap-2 rounded-lg border border-border bg-card text-foreground shadow-none transition-colors hover:bg-muted sm:w-auto"
              onClick={onDownloadExcel}
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>
          </>
        )}

        {showCreateButton && (
          <Button
            onClick={onCreateClick}
            className="flex w-full gap-2 rounded-lg bg-brand-500 text-white shadow-none transition-colors hover:bg-brand-600 sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">{createButtonText}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
