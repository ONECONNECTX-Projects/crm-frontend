"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateOpportunityStageForm from "./create/page";
import Pagination from "@/app/common/pagination";

import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteOpportunityStage,
  getAllOpportunityStages,
  OpportunityStage,
  updateOpportunityStageStatus,
} from "@/app/services/opportunity-stage/opportunity-stage.service";

export default function OpportunityStagesPage() {
  const { showSuccess, showError } = useError();
  const [OpportunityStages, setOpportunityStages] = useState<
    OpportunityStage[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingOpportunityStage, setEditingOpportunityStage] =
    useState<OpportunityStage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "OpportunityStage Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch OpportunityStages from API
  const fetchOpportunityStages = async () => {
    setLoading(true);
    try {
      const response = await getAllOpportunityStages();
      setOpportunityStages(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Opportunity Stages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunityStages();
  }, []);

  const handleStatusToggle = async (
    OpportunityStage: OpportunityStage,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setOpportunityStages((prev) =>
      prev.map((r) =>
        r.id === OpportunityStage.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateOpportunityStageStatus(OpportunityStage.id || 0, newStatus);
      showSuccess(
        `Opportunity Stage ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setOpportunityStages((prev) =>
        prev.map((r) =>
          r.id === OpportunityStage.id
            ? { ...r, is_active: OpportunityStage.is_active }
            : r
        )
      );
      showError("Failed to update Opportunity Stage status");
    }
  };

  // Handle delete OpportunityStage
  const handleDelete = async (OpportunityStage: OpportunityStage) => {
    if (
      !confirm(`Are you sure you want to delete "${OpportunityStage.name}"?`)
    ) {
      return;
    }

    try {
      await deleteOpportunityStage(OpportunityStage.id || 0);
      showSuccess("Opportunity Stage deleted successfully");
      fetchOpportunityStages();
    } catch (error) {
      console.error("Failed to delete Opportunity Stage:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchOpportunityStages();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<OpportunityStage>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingOpportunityStage(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<OpportunityStage>[] = columns.map((col) => ({
    key: col.key as keyof OpportunityStage,
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
      const value = row[col.key as keyof OpportunityStage];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredOpportunityStages = OpportunityStages?.filter(
    (OpportunityStage) =>
      Object.values(OpportunityStage).some((val) =>
        val?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
  );

  const totalItems = filteredOpportunityStages.length;
  const paginatedOpportunityStages = filteredOpportunityStages.slice(
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
          title="Opportunity Stages"
          createButtonText="Create Opportunity Stage"
          onCreateClick={() => {
            setMode("create");
            setEditingOpportunityStage(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Opportunity Stages..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Opportunity Stages...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedOpportunityStages}
            actions={tableActions}
            emptyMessage="No Opportunity Stages found."
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
        <CreateOpportunityStageForm
          mode={mode}
          OpportunityStageData={editingOpportunityStage}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
