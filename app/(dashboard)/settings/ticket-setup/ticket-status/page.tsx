"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateTicketStatusForm from "./create/page";
import Pagination from "@/app/common/pagination";

import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteTicketStatus,
  getAllTicketStatus,
  updateTicketStatusStatus,
  TicketStatus,
} from "@/app/services/ticket-status/ticket-status.service";

export default function TicketStatusPage() {
  const { showSuccess, showError } = useError();
  const [TicketStatus, setTicketStatus] = useState<TicketStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingTicketStatus, setEditingTicketStatus] =
    useState<TicketStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Ticket Status Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch TicketStatus from API
  const fetchTicketStatus = async () => {
    setLoading(true);
    try {
      const response = await getAllTicketStatus();
      setTicketStatus(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Ticket Status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketStatus();
  }, []);

  const handleStatusToggle = async (
    TicketStatus: TicketStatus,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setTicketStatus((prev) =>
      prev.map((r) =>
        r.id === TicketStatus.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateTicketStatusStatus(TicketStatus.id || 0, newStatus);
      showSuccess(
        `Ticket Status ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setTicketStatus((prev) =>
        prev.map((r) =>
          r.id === TicketStatus.id
            ? { ...r, is_active: TicketStatus.is_active }
            : r
        )
      );
      showError("Failed to update Ticket Status status");
    }
  };

  // Handle delete TicketStatus
  const handleDelete = async (TicketStatus: TicketStatus) => {
    if (!confirm(`Are you sure you want to delete "${TicketStatus.name}"?`)) {
      return;
    }

    try {
      await deleteTicketStatus(TicketStatus.id || 0);
      showSuccess("Ticket Status deleted successfully");
      fetchTicketStatus();
    } catch (error) {
      console.error("Failed to delete Ticket Status:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchTicketStatus();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<TicketStatus>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingTicketStatus(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<TicketStatus>[] = columns.map((col) => ({
    key: col.key as keyof TicketStatus,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      if (col.key === "status") {
        return (
          <Toggle
            checked={row.is_active || false}
            onChange={(checked) => handleStatusToggle(row, checked)}
          />
        );
      }
      if (col.key === "createdAt" && row.created_at) {
        return (
          <span>
            {new Date(row.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      }
      const value = row[col.key as keyof TicketStatus];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredTicketStatus = TicketStatus?.filter((TicketStatus) =>
    Object.values(TicketStatus).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredTicketStatus.length;
  const paginatedTicketStatus = filteredTicketStatus.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Ticket Status"
          createButtonText="Create Ticket Status"
          onCreateClick={() => {
            setMode("create");
            setEditingTicketStatus(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Ticket Status..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Ticket Status...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedTicketStatus}
            actions={tableActions}
            emptyMessage="No Ticket Status found."
          />
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* SlideOver with Form */}
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-lg">
        <CreateTicketStatusForm
          mode={mode}
          TicketStatusData={editingTicketStatus}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
