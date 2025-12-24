"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface LeadConfig {
  id: number;
  name: string;
  type: "Source" | "Status";
  description: string;
  order: number;
  status: "active" | "inactive";
  leadsCount: number;
}

const leadConfigs: LeadConfig[] = [
  {
    id: 1,
    name: "Website",
    type: "Source",
    description: "Leads from company website",
    order: 1,
    status: "active",
    leadsCount: 234,
  },
  {
    id: 2,
    name: "Referral",
    type: "Source",
    description: "Leads from customer referrals",
    order: 2,
    status: "active",
    leadsCount: 156,
  },
  {
    id: 3,
    name: "Social Media",
    type: "Source",
    description: "Leads from social media platforms",
    order: 3,
    status: "active",
    leadsCount: 189,
  },
  {
    id: 4,
    name: "Email Campaign",
    type: "Source",
    description: "Leads from email marketing campaigns",
    order: 4,
    status: "active",
    leadsCount: 278,
  },
  {
    id: 5,
    name: "New",
    type: "Status",
    description: "Newly created lead",
    order: 5,
    status: "active",
    leadsCount: 345,
  },
  {
    id: 6,
    name: "Contacted",
    type: "Status",
    description: "Lead has been contacted",
    order: 6,
    status: "active",
    leadsCount: 267,
  },
  {
    id: 7,
    name: "Qualified",
    type: "Status",
    description: "Lead has been qualified as potential customer",
    order: 7,
    status: "active",
    leadsCount: 123,
  },
  {
    id: 8,
    name: "Converted",
    type: "Status",
    description: "Lead converted to opportunity",
    order: 8,
    status: "active",
    leadsCount: 89,
  },
  {
    id: 9,
    name: "Lost",
    type: "Status",
    description: "Lead lost or disqualified",
    order: 9,
    status: "inactive",
    leadsCount: 56,
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

export default function LeadSetupPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof LeadConfig; label: string; visible: boolean }[]
  >([
    { key: "name", label: "Name", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "order", label: "Order", visible: true },
    { key: "leadsCount", label: "Leads", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<LeadConfig>[] = [
    {
      label: "Edit",
      onClick: (row) => console.log("Edit lead config", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete lead config", row),
    },
  ];

  const filtered = leadConfigs.filter((config) =>
    `${config.name} ${config.type} ${config.description}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<LeadConfig>[] = columns
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
        title="Lead Setup"
        createButtonText="Add Lead Config"
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
        emptyMessage="No lead configurations found."
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
          <h2 className="text-xl font-semibold mb-4">Add Lead Config</h2>
          <p className="text-gray-600">
            Lead configuration form will be implemented here.
          </p>
        </div>
      </SlideOver>
    </div>
  );
}