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
import { Filter, Printer, Download, Columns } from "lucide-react";
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
  onDownloadCSV?: () => void;
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
  onDownloadCSV,
}: PageActionsProps) {
  return (
<div className="
  flex flex-col 
  md:flex-row 
  md:items-center 
  md:justify-between 
  gap-4 
  bg-white p-4 
  rounded-lg 
  border border-gray-200
">
  {/* LEFT SECTION */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">

    {/* SEARCH BOX */}
    <div className="w-full sm:w-64 md:w-72">
      <InputField
        placeholder={searchPlaceholder}
        onChange={(e) => onSearchChange(e.target.value)}
        value={searchValue}
      />
    </div>

    {/* FILTER BUTTON */}
    {showFilter && (
      <Button
        variant="outline"
        className="flex gap-2 border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
        onClick={onFilterClick}
      >
        <Filter className="w-4 h-4" />
        Filter
      </Button>
    )}

    {/* COLUMNS DROPDOWN */}
    {showColumns && columns.length > 0 && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-2 border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
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

  {/* RIGHT SECTION (Export Buttons) */}
  {showExport && (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
      <Button
        variant="outline"
        className="flex gap-2 border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
        onClick={onPrintPDF}
      >
        <Printer className="w-4 h-4" />
        Print PDF
      </Button>

      <Button
        variant="outline"
        className="flex gap-2 border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
        onClick={onDownloadCSV}
      >
        <Download className="w-4 h-4" />
        Download CSV
      </Button>
    </div>
  )}
</div>


  );
}