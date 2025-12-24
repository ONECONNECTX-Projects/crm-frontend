"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface Transaction {
  id: number;
  transactionId: string;
  account: string;
  type: "credit" | "debit";
  category: string;
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    transactionId: "TXN-2025-001",
    account: "Main Operating Account",
    type: "credit",
    category: "Sales Revenue",
    amount: 15000,
    description: "Client payment for services",
    status: "completed",
    date: "2025-01-20",
  },
  {
    id: 2,
    transactionId: "TXN-2025-002",
    account: "Payroll Account",
    type: "debit",
    category: "Salary",
    amount: 8500,
    description: "Monthly payroll",
    status: "completed",
    date: "2025-01-19",
  },
  {
    id: 3,
    transactionId: "TXN-2025-003",
    account: "Main Operating Account",
    type: "debit",
    category: "Office Expenses",
    amount: 2200,
    description: "Office supplies and equipment",
    status: "completed",
    date: "2025-01-18",
  },
  {
    id: 4,
    transactionId: "TXN-2025-004",
    account: "Investment Portfolio",
    type: "credit",
    category: "Investment Returns",
    amount: 5000,
    description: "Quarterly dividend payment",
    status: "pending",
    date: "2025-01-17",
  },
  {
    id: 5,
    transactionId: "TXN-2025-005",
    account: "Main Operating Account",
    type: "debit",
    category: "Software Subscription",
    amount: 1200,
    description: "Monthly SaaS subscriptions",
    status: "completed",
    date: "2025-01-16",
  },
  {
    id: 6,
    transactionId: "TXN-2025-006",
    account: "Payroll Account",
    type: "debit",
    category: "Benefits",
    amount: 3500,
    description: "Employee health insurance",
    status: "failed",
    date: "2025-01-15",
  },
  {
    id: 7,
    transactionId: "TXN-2025-007",
    account: "Main Operating Account",
    type: "credit",
    category: "Sales Revenue",
    amount: 22000,
    description: "Enterprise contract payment",
    status: "completed",
    date: "2025-01-14",
  },
  {
    id: 8,
    transactionId: "TXN-2025-008",
    account: "Emergency Fund",
    type: "credit",
    category: "Transfer",
    amount: 10000,
    description: "Monthly savings transfer",
    status: "pending",
    date: "2025-01-13",
  },
];

const statusColorMap = {
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  failed: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const typeColorMap = {
  credit: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  debit: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export default function TransactionPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof Transaction; label: string; visible: boolean }[]
  >([
    { key: "transactionId", label: "Transaction ID", visible: true },
    { key: "account", label: "Account", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "category", label: "Category", visible: true },
    { key: "amount", label: "Amount", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "date", label: "Date", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Transaction>[] = [
    {
      label: "View",
      onClick: (row) => console.log("View transaction", row),
    },
    {
      label: "Edit",
      onClick: (row) => console.log("Edit transaction", row),
    },
    {
      label: "Download Receipt",
      onClick: (row) => console.log("Download receipt", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete transaction", row),
    },
  ];

  const filtered = transactions.filter((txn) =>
    `${txn.transactionId} ${txn.account} ${txn.category} ${txn.description} ${txn.status}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<Transaction>[] = columns
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
        if (col.key === "type") {
          return (
            <StatusBadge
              status={row.type}
              colorMap={typeColorMap}
              variant="default"
            />
          );
        }
        if (col.key === "amount") {
          return (
            <span
              className={`font-semibold ${
                row.type === "credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              {row.type === "credit" ? "+" : "-"}$
              {row.amount.toLocaleString()}
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
        title="Transactions"
        createButtonText="Add Transaction"
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
        emptyMessage="No transactions found."
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
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <p className="text-gray-600">Transaction form will be implemented here.</p>
        </div>
      </SlideOver>
    </div>
  );
}