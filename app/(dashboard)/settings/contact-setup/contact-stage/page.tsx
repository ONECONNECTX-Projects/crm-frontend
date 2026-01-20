"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateContactStageForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";
import {
  ContactStage,
  deleteContactStage,
  getAllContactStages,
  updateContactStageStatus,
} from "@/app/services/contact-stages/contact-stages.service";
import { Toggle } from "@/app/common/toggle";

export default function ContactStagesPage() {
  const { showSuccess, showError } = useError();

  const [ContactStages, setContactStages] = useState<ContactStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingContactStage, setEditingContactStage] =
    useState<ContactStage | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Contact Stage Name", visible: true },
    { key: "status", label: "Status", visible: true },

    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  /* =========================
     Fetch ContactStages
  ========================== */
  const fetchContactStages = async () => {
    setLoading(true);
    try {
      const response = await getAllContactStages();
      setContactStages(response.data || []);
    } catch (error) {
      console.error("Failed to fetch ContactStages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactStages();
  }, []);

  /* =========================
     Delete ContactStage
  ========================== */
  const handleDelete = async (ContactStage: ContactStage) => {
    if (!confirm(`Are you sure you want to delete "${ContactStage.name}"?`)) {
      return;
    }

    try {
      await deleteContactStage(ContactStage.id || 0);
      showSuccess("Contact Stage deleted successfully");
      fetchContactStages();
    } catch (error) {
      console.error("Failed to delete Contact Stage:", error);
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingContactStage(null);
    fetchContactStages();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };
  const handleStatusToggle = async (
    contactStage: ContactStage,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setContactStages((prev) =>
      prev.map((r) =>
        r.id === contactStage.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateContactStageStatus(contactStage.id || 0, newStatus);
      showSuccess(
        `Contact Stage ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setContactStages((prev) =>
        prev.map((r) =>
          r.id === contactStage.id
            ? { ...r, is_active: contactStage.is_active }
            : r
        )
      );
      showError("Failed to update Contact Stage status");
    }
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<ContactStage>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingContactStage(row);
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
  const tableColumns: TableColumn<ContactStage>[] = columns.map((col) => ({
    key: col.key as keyof ContactStage,
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
      const value = row[col.key as keyof ContactStage];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredContactStages = ContactStages.filter((ContactStage) =>
    Object.values(ContactStage).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredContactStages.length;

  const paginatedContactStages = filteredContactStages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Contact Stage"
          createButtonText="Create Contact Stage"
          onCreateClick={() => {
            setMode("create");
            setEditingContactStage(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Contact Stage..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Contact Stage...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedContactStages}
            actions={tableActions}
            emptyMessage="No Contact Stage found."
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
        <CreateContactStageForm
          mode={mode}
          ContactStageData={editingContactStage}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
