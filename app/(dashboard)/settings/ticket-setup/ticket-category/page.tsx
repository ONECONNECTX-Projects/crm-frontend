"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateTicketCategoryForm from "./create/page";
import Pagination from "@/app/common/pagination";

import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteTicketCategory,
  getAllTicketCategory,
  updateTicketCategoryStatus,
  TicketCategory,
} from "@/app/services/ticket-category/ticket-category.service";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function TicketCategoryPage() {
  const { showSuccess, showError } = useError();
  const [TicketCategory, setTicketCategory] = useState<TicketCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingTicketCategory, setEditingTicketCategory] =
    useState<TicketCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Ticket Category Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch TicketCategory from API
  const fetchTicketCategory = async () => {
    setLoading(true);
    try {
      const response = await getAllTicketCategory();
      setTicketCategory(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Ticket Category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketCategory();
  }, []);

  const handleStatusToggle = async (
    TicketCategory: TicketCategory,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setTicketCategory((prev) =>
      prev.map((r) =>
        r.id === TicketCategory.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateTicketCategoryStatus(TicketCategory.id || 0, newStatus);
      showSuccess(
        `Ticket Category ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setTicketCategory((prev) =>
        prev.map((r) =>
          r.id === TicketCategory.id
            ? { ...r, is_active: TicketCategory.is_active }
            : r
        )
      );
      showError("Failed to update Ticket Category status");
    }
  };

  // Handle delete TicketCategory
  const handleDelete = async (TicketCategory: TicketCategory) => {
    if (!confirm(`Are you sure you want to delete "${TicketCategory.name}"?`)) {
      return;
    }

    try {
      await deleteTicketCategory(TicketCategory.id || 0);
      showSuccess("Ticket Category deleted successfully");
      fetchTicketCategory();
    } catch (error) {
      console.error("Failed to delete Ticket Category:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchTicketCategory();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<TicketCategory>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingTicketCategory(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<TicketCategory>[] = columns.map((col) => ({
    key: col.key as keyof TicketCategory,
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
      const value = row[col.key as keyof TicketCategory];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredTicketCategory = TicketCategory?.filter((TicketCategory) =>
    Object.values(TicketCategory).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredTicketCategory.length;
  const paginatedTicketCategory = filteredTicketCategory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const extractors: Record<string, (row: TicketCategory) => string> = {
    status: (row) => (row.is_active ? "Active" : "Inactive"),
    createdAt: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredTicketCategory, columns, "ticket-categories", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredTicketCategory, columns, "Ticket Categories", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Ticket Category"
          createButtonText="Create Ticket Category"
          onCreateClick={() => {
            setMode("create");
            setEditingTicketCategory(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Ticket Categories..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Ticket Categories...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedTicketCategory}
            actions={tableActions}
            emptyMessage="No Ticket Category found."
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
        <CreateTicketCategoryForm
          mode={mode}
          TicketCategoryData={editingTicketCategory}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
