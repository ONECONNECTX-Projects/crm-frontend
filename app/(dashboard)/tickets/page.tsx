"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import TicketForm from "./create/page";
import { useRouter } from "next/navigation";
import { getAllTicket, Ticket } from "@/app/services/tickets/tickets.service";
import { useError } from "@/app/providers/ErrorProvider";

const priorityColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  low: {
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
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

const statusColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  open: {
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
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
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showError } = useError();

  const [columns, setColumns] = useState<
    { key: string; label: string; visible: boolean }[]
  >([
    { key: "id", label: "Ticket ID", visible: true },
    { key: "subject", label: "Subject", visible: true },
    { key: "customer", label: "Customer", visible: true },
    { key: "category", label: "Category", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTicket();
      if (response.isSuccess && response.data) {
        setTickets(response.data);
      } else {
        showError(response.message || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      showError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Ticket>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/tickets/${row.id}`),
    },
  ];

  const filtered = tickets.filter((ticket) =>
    `${ticket.id} ${ticket.subject} ${ticket.customer?.name || ""} ${ticket.status?.name || ""}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCreateClick = () => {
    setOpenForm(true);
  };

  const tableColumns: TableColumn<Ticket>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
      label: col.label,
      visible: col.visible,
      render: (row: Ticket) => {
        if (col.key === "status") {
          const statusName = row.status?.name?.toLowerCase() || "";
          return (
            <StatusBadge
              status={row.status?.name || "N/A"}
              colorMap={statusColorMap}
              variant="default"
            />
          );
        }
        if (col.key === "priority") {
          const priorityName = row.priority?.name?.toLowerCase() || "";
          return (
            <StatusBadge
              status={row.priority?.name || "N/A"}
              colorMap={priorityColorMap}
              variant="default"
            />
          );
        }
        if (col.key === "customer") {
          return (
            <span className="truncate block max-w-[200px]">
              {row.customer?.name || "N/A"}
            </span>
          );
        }
        if (col.key === "category") {
          return (
            <span className="truncate block max-w-[200px]">
              {row.category?.name || "N/A"}
            </span>
          );
        }
        if (col.key === "id") {
          return (
            <span className="truncate block max-w-[200px]">
              TKT-{String(row.id).padStart(4, "0")}
            </span>
          );
        }
        if (col.key === "subject") {
          return (
            <span className="truncate block max-w-[200px]">
              {row.subject || ""}
            </span>
          );
        }
        return (
          <span className="truncate block max-w-[200px]">
            {String(row[col.key as keyof Ticket] ?? "")}
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
        emptyMessage={loading ? "Loading tickets..." : "No tickets found."}
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
            onCancel={() => setOpenForm(false)}
            onSuccess={() => {
              setOpenForm(false);
              fetchTickets();
            }}
          />
        </div>
      </SlideOver>
    </div>
  );
}
