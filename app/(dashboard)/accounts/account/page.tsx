"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface Account {
  id: number;
  accountNumber: string;
  accountName: string;
  accountType: "savings" | "checking" | "business" | "investment";
  balance: number;
  currency: string;
  status: "active" | "inactive" | "frozen";
  createdDate: string;
}

const accounts: Account[] = [
  {
    id: 1,
    accountNumber: "ACC-2025-001",
    accountName: "Main Operating Account",
    accountType: "business",
    balance: 125000,
    currency: "USD",
    status: "active",
    createdDate: "2025-01-01",
  },
  {
    id: 2,
    accountNumber: "ACC-2025-002",
    accountName: "Payroll Account",
    accountType: "checking",
    balance: 75000,
    currency: "USD",
    status: "active",
    createdDate: "2025-01-02",
  },
  {
    id: 3,
    accountNumber: "ACC-2025-003",
    accountName: "Emergency Fund",
    accountType: "savings",
    balance: 50000,
    currency: "USD",
    status: "active",
    createdDate: "2025-01-03",
  },
  {
    id: 4,
    accountNumber: "ACC-2025-004",
    accountName: "Investment Portfolio",
    accountType: "investment",
    balance: 250000,
    currency: "USD",
    status: "active",
    createdDate: "2025-01-04",
  },
  {
    id: 5,
    accountNumber: "ACC-2025-005",
    accountName: "Client Escrow Account",
    accountType: "business",
    balance: 100000,
    currency: "USD",
    status: "frozen",
    createdDate: "2025-01-05",
  },
  {
    id: 6,
    accountNumber: "ACC-2025-006",
    accountName: "Petty Cash Account",
    accountType: "checking",
    balance: 5000,
    currency: "USD",
    status: "active",
    createdDate: "2025-01-06",
  },
  {
    id: 7,
    accountNumber: "ACC-2025-007",
    accountName: "Old Business Account",
    accountType: "business",
    balance: 0,
    currency: "USD",
    status: "inactive",
    createdDate: "2024-12-01",
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
  frozen: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const typeColorMap = {
  savings: {
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
  },
  checking: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  business: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  investment: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
};

export default function AccountPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof Account; label: string; visible: boolean }[]
  >([
    { key: "accountNumber", label: "Account Number", visible: true },
    { key: "accountName", label: "Account Name", visible: true },
    { key: "accountType", label: "Type", visible: true },
    { key: "balance", label: "Balance", visible: true },
    { key: "currency", label: "Currency", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdDate", label: "Created Date", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Account>[] = [
    {
      label: "Edit",
      onClick: (row) => console.log("Edit account", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete account", row),
    },
  ];

  const filtered = accounts.filter((acc) =>
    `${acc.accountNumber} ${acc.accountName} ${acc.accountType} ${acc.status}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<Account>[] = columns
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
        if (col.key === "accountType") {
          return (
            <StatusBadge
              status={row.accountType}
              colorMap={typeColorMap}
              variant="default"
            />
          );
        }
        if (col.key === "balance") {
          return (
            <span className="font-semibold text-green-600">
              ${row.balance.toLocaleString()}
            </span>
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
        title="Accounts"
        createButtonText="Create Account"
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
        emptyMessage="No accounts found."
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
          <h2 className="text-xl font-semibold mb-4">Create Account</h2>
          <p className="text-gray-600">
            Account creation form will be implemented here.
          </p>
        </div>
      </SlideOver>
    </div>
  );
}
