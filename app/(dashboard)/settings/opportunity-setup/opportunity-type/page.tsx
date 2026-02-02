"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateOpportunityTypeForm from "./create/page";
import Pagination from "@/app/common/pagination";

import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteOpportunityType,
  getAllOpportunityTypes,
  OpportunityType,
  updateOpportunityTypeStatus,
} from "@/app/services/opportunity-types/opportunity-types.service";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function OpportunityTypesPage() {
  const { showSuccess, showError } = useError();
  const [OpportunityTypes, setOpportunityTypes] = useState<OpportunityType[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingOpportunityType, setEditingOpportunityType] =
    useState<OpportunityType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "OpportunityType Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch OpportunityTypes from API
  const fetchOpportunityTypes = async () => {
    setLoading(true);
    try {
      const response = await getAllOpportunityTypes();
      setOpportunityTypes(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Opportunity Types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunityTypes();
  }, []);

  const handleStatusToggle = async (
    OpportunityType: OpportunityType,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setOpportunityTypes((prev) =>
      prev.map((r) =>
        r.id === OpportunityType.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateOpportunityTypeStatus(OpportunityType.id || 0, newStatus);
      showSuccess(
        `Opportunity Type ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setOpportunityTypes((prev) =>
        prev.map((r) =>
          r.id === OpportunityType.id
            ? { ...r, is_active: OpportunityType.is_active }
            : r
        )
      );
      showError("Failed to update Opportunity Type status");
    }
  };

  // Handle delete OpportunityType
  const handleDelete = async (OpportunityType: OpportunityType) => {
    if (
      !confirm(`Are you sure you want to delete "${OpportunityType.name}"?`)
    ) {
      return;
    }

    try {
      await deleteOpportunityType(OpportunityType.id || 0);
      showSuccess("Opportunity Type deleted successfully");
      fetchOpportunityTypes();
    } catch (error) {
      console.error("Failed to delete Opportunity Type:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchOpportunityTypes();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<OpportunityType>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingOpportunityType(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<OpportunityType>[] = columns.map((col) => ({
    key: col.key as keyof OpportunityType,
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
      const value = row[col.key as keyof OpportunityType];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredOpportunityTypes = OpportunityTypes?.filter((OpportunityType) =>
    Object.values(OpportunityType).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredOpportunityTypes.length;
  const paginatedOpportunityTypes = filteredOpportunityTypes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const extractors: Record<string, (row: OpportunityType) => string> = {
    status: (row) => (row.is_active ? "Active" : "Inactive"),
    createdAt: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredOpportunityTypes, columns, "opportunity-types", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredOpportunityTypes, columns, "Opportunity Types", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Opportunity Types"
          createButtonText="Create Opportunity Type"
          onCreateClick={() => {
            setMode("create");
            setEditingOpportunityType(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Opportunity Types..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Opportunity Types...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedOpportunityTypes}
            actions={tableActions}
            emptyMessage="No Opportunity Types found."
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
        <CreateOpportunityTypeForm
          mode={mode}
          OpportunityTypeData={editingOpportunityType}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
