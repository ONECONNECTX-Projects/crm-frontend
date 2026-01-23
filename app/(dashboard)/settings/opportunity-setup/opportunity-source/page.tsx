"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateOpportunitySourceForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteOpportunitySource,
  getAllOpportunitySources,
  OpportunitySource,
  updateOpportunitySourceStatus,
} from "@/app/services/opportunity-source/opportunity-source.service";

export default function OpportunitySourcesPage() {
  const { showSuccess, showError } = useError();
  const [OpportunitySources, setOpportunitySources] = useState<
    OpportunitySource[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingOpportunitySource, setEditingOpportunitySource] =
    useState<OpportunitySource | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "OpportunitySource Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch OpportunitySources from API
  const fetchOpportunitySources = async () => {
    setLoading(true);
    try {
      const response = await getAllOpportunitySources();
      setOpportunitySources(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Opportunity Sources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunitySources();
  }, []);

  const handleStatusToggle = async (
    OpportunitySource: OpportunitySource,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setOpportunitySources((prev) =>
      prev.map((r) =>
        r.id === OpportunitySource.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateOpportunitySourceStatus(OpportunitySource.id || 0, newStatus);
      showSuccess(
        `Opportunity Source ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setOpportunitySources((prev) =>
        prev.map((r) =>
          r.id === OpportunitySource.id
            ? { ...r, is_active: OpportunitySource.is_active }
            : r
        )
      );
      showError("Failed to update Opportunity Source status");
    }
  };

  // Handle delete OpportunitySource
  const handleDelete = async (OpportunitySource: OpportunitySource) => {
    if (
      !confirm(`Are you sure you want to delete "${OpportunitySource.name}"?`)
    ) {
      return;
    }

    try {
      await deleteOpportunitySource(OpportunitySource.id || 0);
      showSuccess("Opportunity Source deleted successfully");
      fetchOpportunitySources();
    } catch (error) {
      console.error("Failed to delete Opportunity Source:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchOpportunitySources();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<OpportunitySource>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingOpportunitySource(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<OpportunitySource>[] = columns.map((col) => ({
    key: col.key as keyof OpportunitySource,
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
      const value = row[col.key as keyof OpportunitySource];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredOpportunitySources = OpportunitySources?.filter(
    (OpportunitySource) =>
      Object.values(OpportunitySource).some((val) =>
        val?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
  );

  const totalItems = filteredOpportunitySources.length;
  const paginatedOpportunitySources = filteredOpportunitySources.slice(
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
          title="Opportunity Sources"
          createButtonText="Create Opportunity Source"
          onCreateClick={() => {
            setMode("create");
            setEditingOpportunitySource(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Opportunity Sources..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Opportunity Sources...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedOpportunitySources}
            actions={tableActions}
            emptyMessage="No Opportunity Sources found."
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
        <CreateOpportunitySourceForm
          mode={mode}
          OpportunitySourceData={editingOpportunitySource}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
