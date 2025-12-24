"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import TicketForm, { TicketFormData, TicketFormMode } from "./create/page";
import { useRouter } from "next/navigation";

interface Ticket {
  id: number;
  ticketNumber: string;
  subject: string;
  customer: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdDate: string;
}

const tickets: Ticket[] = [
  {
    id: 1,
    ticketNumber: "TKT-2025-001",
    subject: "Login Issue",
    customer: "Acme Corporation",
    priority: "high",
    status: "open",
    createdDate: "2025-01-15",
  },
  {
    id: 2,
    ticketNumber: "TKT-2025-002",
    subject: "Payment Gateway Error",
    customer: "Tech Solutions Inc",
    priority: "urgent",
    status: "in_progress",
    createdDate: "2025-01-16",
  },
  {
    id: 3,
    ticketNumber: "TKT-2025-003",
    subject: "Feature Request - Dark Mode",
    customer: "Global Enterprises",
    priority: "low",
    status: "open",
    createdDate: "2025-01-17",
  },
  {
    id: 4,
    ticketNumber: "TKT-2025-004",
    subject: "Data Export Not Working",
    customer: "Startup Ventures",
    priority: "medium",
    status: "resolved",
    createdDate: "2025-01-14",
  },
  {
    id: 5,
    ticketNumber: "TKT-2025-005",
    subject: "Password Reset Email Not Received",
    customer: "Enterprise Systems",
    priority: "high",
    status: "in_progress",
    createdDate: "2025-01-18",
  },
  {
    id: 6,
    ticketNumber: "TKT-2025-006",
    subject: "API Integration Question",
    customer: "Digital Marketing Co",
    priority: "medium",
    status: "closed",
    createdDate: "2025-01-12",
  },
  {
    id: 7,
    ticketNumber: "TKT-2025-007",
    subject: "Invoice Download Error",
    customer: "Innovation Labs",
    priority: "high",
    status: "open",
    createdDate: "2025-01-19",
  },
  {
    id: 8,
    ticketNumber: "TKT-2025-008",
    subject: "User Permissions Not Updating",
    customer: "Future Technologies",
    priority: "urgent",
    status: "in_progress",
    createdDate: "2025-01-20",
  },
  {
    id: 9,
    ticketNumber: "TKT-2025-009",
    subject: "Dashboard Loading Slowly",
    customer: "Acme Corporation",
    priority: "medium",
    status: "open",
    createdDate: "2025-01-21",
  },
  {
    id: 10,
    ticketNumber: "TKT-2025-010",
    subject: "Mobile App Crash on Startup",
    customer: "Tech Solutions Inc",
    priority: "urgent",
    status: "in_progress",
    createdDate: "2025-01-22",
  },
];

const priorityColorMap = {
  low: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  high: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  urgent: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const statusColorMap = {
  open: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  in_progress: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  resolved: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  closed: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function TicketPage() {
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<TicketFormMode>("create");
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const [columns, setColumns] = useState<
    { key: keyof Ticket; label: string; visible: boolean }[]
  >([
    { key: "ticketNumber", label: "Ticket Number", visible: true },
    { key: "subject", label: "Subject", visible: true },
    { key: "customer", label: "Customer", visible: true },
    { key: "priority", label: "Priority", visible: true },
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

  const handleEditClick = (ticket: Ticket) => {
    setFormMode("edit");
    setEditingTicket(ticket);
    setOpenForm(true);
  };

  const actions: TableAction<Ticket>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/tickets/${row.id}`),
    },
    {
      label: "Edit",
      onClick: (row) => handleEditClick(row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete ticket", row),
    },
  ];

  const filtered = tickets.filter((ticket) =>
    `${ticket.ticketNumber} ${ticket.subject} ${ticket.customer} ${ticket.status}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCreateClick = () => {
    setFormMode("create");
    setEditingTicket(null);
    setOpenForm(true);
  };

  const tableColumns: TableColumn<Ticket>[] = columns
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
        if (col.key === "priority") {
          return (
            <StatusBadge
              status={row.priority}
              colorMap={priorityColorMap}
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
        title="Tickets"
        createButtonText="Create Ticket"
        onCreateClick={handleCreateClick}
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
        emptyMessage="No tickets found."
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

      <SlideOver open={openForm} onClose={() => setOpenForm(false)}>
        <div className="p-6">
          <TicketForm
            mode={formMode}
            initialData={
              formMode === "edit" && editingTicket
                ? {
                    email: "", // if available
                    customer: editingTicket.customer,
                    priority: editingTicket.priority,
                    subject: editingTicket.subject,
                    description: "", // if available
                  }
                : undefined
            }
            onCancel={() => setOpenForm(false)}
            onSubmit={(data: TicketFormData) => {
              if (formMode === "create") {
                console.log("CREATE TICKET", data);
              } else {
                console.log("UPDATE TICKET ID:", editingTicket?.id, data);
              }
              setOpenForm(false);
            }}
          />
        </div>
      </SlideOver>
    </div>
  );
}
