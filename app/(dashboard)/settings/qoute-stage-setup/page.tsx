"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface QuoteStage {
  id: number;
  name: string;
  description: string;
  order: number;
  isDefault: boolean;
  status: "active" | "inactive";
  quotesCount: number;
}

const quoteStages: QuoteStage[] = [
  {
    id: 1,
    name: "Draft",
    description: "Quote is being prepared",
    order: 1,
    isDefault: true,
    status: "active",
    quotesCount: 134,
  },
  {
    id: 2,
    name: "Review",
    description: "Quote is under internal review",
    order: 2,
    isDefault: false,
    status: "active",
    quotesCount: 67,
  },
  {
    id: 3,
    name: "Sent",
    description: "Quote has been sent to customer",
    order: 3,
    isDefault: false,
    status: "active",
    quotesCount: 289,
  },
  {
    id: 4,
    name: "Negotiation",
    description: "Quote is being negotiated with customer",
    order: 4,
    isDefault: false,
    status: "active",
    quotesCount: 156,
  },
  {
    id: 5,
    name: "Accepted",
    description: "Quote has been accepted by customer",
    order: 5,
    isDefault: false,
    status: "active",
    quotesCount: 445,
  },
  {
    id: 6,
    name: "Rejected",
    description: "Quote has been rejected by customer",
    order: 6,
    isDefault: false,
    status: "inactive",
    quotesCount: 78,
  },
  {
    id: 7,
    name: "Expired",
    description: "Quote has expired",
    order: 7,
    isDefault: false,
    status: "inactive",
    quotesCount: 234,
  },
];

const statusColorMap = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function QouteStageSetupPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof QuoteStage; label: string; visible: boolean }[]
  >([
    { key: "name", label: "Name", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "order", label: "Order", visible: true },
    { key: "isDefault", label: "Default", visible: true },
    { key: "quotesCount", label: "Quotes", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<QuoteStage>[] = [
    {
      label: "Edit",
      onClick: (row) => console.log("Edit quote stage", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete quote stage", row),
    },
  ];

  const filtered = quoteStages.filter((stage) =>
    `${stage.name} ${stage.description}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<QuoteStage>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
      label: col.label,
      visible: col.visible,
      render: (row) => {
        if (col.key === "status") {
          return (
            <StatusBadge
              status={row.status}
              colorMap={statusColorMap}
              variant="default"
            />
          );
        }
        if (col.key === "isDefault") {
          return <span>{row.isDefault ? "Yes" : "No"}</span>;
        }
        return (
          <span className="truncate block max-w-[200px]">
            {String(row[col.key])}
          </span>
        );
      },
    }));

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <PageHeader
        title="Quote Stage Setup"
        createButtonText="Add Quote Stage"
        onCreateClick={() => setOpenCreate(true)}
      />

      <PageActions
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable
        columns={tableColumns}
        data={paginatedData}
        actions={actions}
        emptyMessage="No quote stages found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Quote Stage</h2>
          <p className="text-gray-600">
            Quote stage configuration form will be implemented here.
          </p>
        </div>
      </SlideOver>
    </div>
  );
}