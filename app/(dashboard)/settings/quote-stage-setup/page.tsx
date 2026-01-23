"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateQuoteStageForm from "./create/page";
import Pagination from "@/app/common/pagination";

import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteQuoteStage,
  getAllQuoteStages,
  QuoteStage,
  updateQuoteStageStatus,
} from "@/app/services/quote-stage-setup/quote-stage-setup.service";

export default function QuoteStagesPage() {
  const { showSuccess, showError } = useError();
  const [QuoteStages, setQuoteStages] = useState<QuoteStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingQuoteStage, setEditingQuoteStage] = useState<QuoteStage | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Quote Stage Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch QuoteStages from API
  const fetchQuoteStages = async () => {
    setLoading(true);
    try {
      const response = await getAllQuoteStages();
      setQuoteStages(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Quote Stage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuoteStages();
  }, []);

  const handleStatusToggle = async (
    QuoteStage: QuoteStage,
    newStatus: boolean,
  ) => {
    // Optimistic UI update
    setQuoteStages((prev) =>
      prev.map((r) =>
        r.id === QuoteStage.id ? { ...r, is_active: newStatus } : r,
      ),
    );

    try {
      await updateQuoteStageStatus(QuoteStage.id || 0, newStatus);
      showSuccess(
        `Quote Stage ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      // Rollback if API fails
      setQuoteStages((prev) =>
        prev.map((r) =>
          r.id === QuoteStage.id
            ? { ...r, is_active: QuoteStage.is_active }
            : r,
        ),
      );
      showError("Failed to update Quote Stage status");
    }
  };

  // Handle delete QuoteStage
  const handleDelete = async (QuoteStage: QuoteStage) => {
    if (!confirm(`Are you sure you want to delete "${QuoteStage.name}"?`)) {
      return;
    }

    try {
      await deleteQuoteStage(QuoteStage.id || 0);
      showSuccess("Quote Stage deleted successfully");
      fetchQuoteStages();
    } catch (error) {
      console.error("Failed to delete Quote Stage:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchQuoteStages();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const tableActions: TableAction<QuoteStage>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingQuoteStage(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<QuoteStage>[] = columns.map((col) => ({
    key: col.key as keyof QuoteStage,
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
      const value = row[col.key as keyof QuoteStage];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredQuoteStages = QuoteStages?.filter((QuoteStage) =>
    Object.values(QuoteStage).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase()),
    ),
  );

  const totalItems = filteredQuoteStages.length;
  const paginatedQuoteStages = filteredQuoteStages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Quote Stage"
          createButtonText="Create Quote Stage"
          onCreateClick={() => {
            setMode("create");
            setEditingQuoteStage(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Quote Stage..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Quote Stage...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedQuoteStages}
            actions={tableActions}
            emptyMessage="No Quote Stages found."
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
        <CreateQuoteStageForm
          mode={mode}
          QuoteStageData={editingQuoteStage}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
