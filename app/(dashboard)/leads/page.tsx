"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import StatusBadge from "@/app/common/StatusBadge";
import { useRouter } from "next/navigation";
import SlideOver from "@/app/common/slideOver";
import CreateLeadForm from "./create/page";
import Pagination from "@/app/common/pagination";
import {
  getAllLead,
  deleteLead,
  Leads,
} from "@/app/services/lead/lead.service";
import { useError } from "@/app/providers/ErrorProvider";

export default function LeadsPage() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { showSuccess, showError } = useError();

  const [editingLead, setEditingLead] = useState<Leads | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [leads, setLeads] = useState<Leads[]>([]);
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState([
    { key: "id", label: "Id", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone Number", visible: true },
    { key: "owner", label: "Lead Owner", visible: true },
    { key: "status", label: "Lead Status", visible: true },
    { key: "value", label: "Lead Value", visible: true },
    { key: "source", label: "Lead Source", visible: true },
    { key: "convert", label: "Convert Status", visible: true },
  ]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await getAllLead();
      setLeads(response.data || []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const handleDelete = async (lead: Leads) => {
    if (window.confirm(`Are you sure you want to delete "${lead.name}"?`)) {
      try {
        await deleteLead(lead.id);
        showSuccess("Lead deleted successfully");
        fetchLeads();
      } catch (error) {
        console.error("Failed to delete lead:", error);
        showError("Failed to delete lead");
      }
    }
  };

  const handleFormSuccess = () => {
    setOpenCreate(false);
    fetchLeads();
  };

  const tableColumns: TableColumn<Leads>[] = [
    {
      key: "id",
      label: "Id",
      visible: columns.find((c) => c.key === "id")?.visible,
      render: (row) => (
        <span className="font-medium text-gray-900">#{row.id}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      visible: columns.find((c) => c.key === "name")?.visible,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      visible: columns.find((c) => c.key === "email")?.visible,
      render: (row) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      key: "phone",
      label: "Phone",
      visible: columns.find((c) => c.key === "phone")?.visible,
      render: (row) => <span className="text-gray-600">{row.phone}</span>,
    },
    {
      key: "owner",
      label: "Lead Owner",
      visible: columns.find((c) => c.key === "owner")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.owner?.name || "-"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      visible: columns.find((c) => c.key === "status")?.visible,
      render: (row) => (
        <StatusBadge
          status={row.status?.name?.toLowerCase() || "new"}
          variant="lead"
        />
      ),
    },
    {
      key: "value",
      label: "Value",
      visible: columns.find((c) => c.key === "value")?.visible,
      render: (row) => (
        <span className="font-semibold text-green-600">
          ${parseInt(row.lead_value || "0").toLocaleString()}
        </span>
      ),
    },
    {
      key: "source",
      label: "Source",
      visible: columns.find((c) => c.key === "source")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.source?.name || "-"}</span>
      ),
    },
    {
      key: "convert",
      label: "Convert Status",
      visible: columns.find((c) => c.key === "convert")?.visible,
      render: (row) => (
        <span className="text-gray-500 text-sm italic">Not Converted</span>
      ),
    },
  ];

  const tableActions: TableAction<Leads>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/leads/${row.id}`);
      },
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingLead(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Convert",
      onClick: (row) => {
        router.push(`/leads/${row.id}/convert`);
      },
    },
    {
      label: "Delete",
      onClick: (row) => handleDelete(row),
      variant: "destructive",
    },
  ];

  const filteredLeads = leads.filter((lead) =>
    Object.values(lead).some((value) =>
      value?.toString().toLowerCase().includes(searchValue.toLowerCase()),
    ),
  );

  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (safePage - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      <div className="min-h-screen bg-white rounded-xl p-6">
        <div className="max-w-9xl mx-auto space-y-6">
          <PageHeader
            title="Leads"
            createButtonText="Create Lead"
            onCreateClick={() => {
              setMode("create");
              setEditingLead(null);
              setOpenCreate(true);
            }}
          />

          <PageActions
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search leads by name, email, phone..."
            columns={columns}
            onColumnToggle={handleColumnToggle}
            onFilterClick={() => console.log("Filter clicked")}
            onPrintPDF={() => console.log("Print PDF")}
            onDownloadCSV={() => console.log("Download CSV")}
          />

          <DataTable
            columns={tableColumns}
            data={paginatedLeads}
            actions={tableActions}
            emptyMessage="No leads found. Create your first lead to get started!"
          />
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
      </div>
      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateLeadForm
          mode={mode}
          data={editingLead || undefined}
          onClose={() => setOpenCreate(false)}
          onSuccess={handleFormSuccess}
        />
      </SlideOver>
    </>
  );
}
