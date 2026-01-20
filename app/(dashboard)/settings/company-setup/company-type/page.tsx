"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateCompanyTypeForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";
import {
  CompanyType,
  deleteCompanyType,
  getAllCompanyTypes,
  updateCompanyTypeStatus,
} from "@/app/services/company-type/company-type.service";
import { Toggle } from "@/app/common/toggle";

export default function CompanyTypesPage() {
  const { showSuccess, showError } = useError();

  const [companies, setCompanyType] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingCompanyType, setEditingCompanyType] =
    useState<CompanyType | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "CompanyType Name", visible: true },
    { key: "status", label: "Status", visible: true },

    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  /* =========================
     Fetch CompanyType
  ========================== */
  const fetchCompanyType = async () => {
    setLoading(true);
    try {
      const response = await getAllCompanyTypes();
      setCompanyType(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Company Type:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyType();
  }, []);

  /* =========================
     Delete CompanyType
  ========================== */
  const handleDelete = async (CompanyType: CompanyType) => {
    if (!confirm(`Are you sure you want to delete "${CompanyType.name}"?`)) {
      return;
    }

    try {
      await deleteCompanyType(CompanyType.id || 0);
      showSuccess("CompanyType deleted successfully");
      fetchCompanyType();
    } catch (error) {
      console.error("Failed to delete Company Type:", error);
    }
  };

  const handleStatusToggle = async (
    companyType: CompanyType,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setCompanyType((prev) =>
      prev.map((r) =>
        r.id === companyType.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateCompanyTypeStatus(companyType.id || 0, newStatus);
      showSuccess(
        `Company Type ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setCompanyType((prev) =>
        prev.map((r) =>
          r.id === companyType.id
            ? { ...r, is_active: companyType.is_active }
            : r
        )
      );
      showError("Failed to update Company Type status");
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingCompanyType(null);
    fetchCompanyType();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<CompanyType>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingCompanyType(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  /* =========================
     Table Columns
  ========================== */
  const tableColumns: TableColumn<CompanyType>[] = columns.map((col) => ({
    key: col.key as keyof CompanyType,
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
      const value = row[col.key as keyof CompanyType];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredCompanyType = companies.filter((CompanyType) =>
    Object.values(CompanyType).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredCompanyType.length;

  const paginatedCompanyType = filteredCompanyType.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Company Type"
          createButtonText="Create Company Type"
          onCreateClick={() => {
            setMode("create");
            setEditingCompanyType(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Company Type..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Company Type...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedCompanyType}
            actions={tableActions}
            emptyMessage="No Company Type found."
          />
        )}
      </div>

      {/* Pagination */}
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

      {/* SlideOver */}
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-lg">
        <CreateCompanyTypeForm
          mode={mode}
          CompanyTypeData={editingCompanyType}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
