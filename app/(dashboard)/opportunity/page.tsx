"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction } from "@/app/common/DataTable";
import Pagination from "@/app/common/pagination";
import SlideOver from "@/app/common/slideOver";
import CreateOpportunity from "./create/page";
import { useError } from "@/app/providers/ErrorProvider";
import {
  deleteOpportunity,
  getAllOpportunity,
  Opportunity,
} from "@/app/services/opportunity/opportunity.service";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function OpportunityPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showError, showSuccess } = useError();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [editingOpportunities, setEditingOpportunities] =
    useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [columns, setColumns] = useState<
    {
      key: string;
      label: string;
      visible: boolean;
      render?: (row: Opportunity) => React.ReactNode;
    }[]
  >([
    { key: "name", label: "Name", visible: true },
    {
      key: "owner",
      label: "Owner",
      visible: true,
      render: (row: Opportunity) => row.owner?.name || "-",
    },
    { key: "amount", label: "Amount", visible: true },
    {
      key: "company",
      label: "Company",
      visible: true,
      render: (row: Opportunity) => row.company?.name || "-",
    },
    {
      key: "stage",
      label: "Stage",
      visible: true,
      render: (row: Opportunity) => row.stage?.name || "-",
    },
    {
      key: "type",
      label: "Type",
      visible: true,
      render: (row: Opportunity) => row.type?.name || "-",
    },
    {
      key: "source",
      label: "Source",
      visible: true,
      render: (row: Opportunity) => row.source?.name || "-",
    },
    {
      key: "created_at",
      label: "Create date",
      visible: true,
      render: (row: Opportunity) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
    },
  ]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const response = await getAllOpportunity();
      setOpportunities(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const handleDelete = async (opportunity: Opportunity) => {
    if (
      window.confirm(`Are you sure you want to delete "${opportunity.name}"?`)
    ) {
      try {
        await deleteOpportunity(opportunity.id);
        showSuccess("opportunity deleted successfully");
        fetchOpportunities();
      } catch (error) {
        console.error("Failed to delete opportunity:", error);
        showError("Failed to delete opportunity");
      }
    }
  };

  const actions: TableAction<Opportunity>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/opportunity/${row.id}`),
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingOpportunities(row);
        setOpen(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => handleDelete(row),
      variant: "destructive",
    },
  ];

  const handleFormSuccess = () => {
    setOpen(false);
    fetchOpportunities();
  };

  // Custom extractors for nested objects and formatted values
  const opportunityExtractors: Record<string, (row: Opportunity) => string> = {
    owner: (row) => row.owner?.name || "-",
    company: (row) => row.company?.name || "-",
    stage: (row) => row.stage?.name || "-",
    type: (row) => row.type?.name || "-",
    source: (row) => row.source?.name || "-",
    created_at: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(opportunities, columns, "opportunities", opportunityExtractors);
  };

  const handlePrintPDF = () => {
    printPDF(opportunities, columns, "Opportunities", opportunityExtractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
      <div className="max-w-9xl mx-auto space-y-4 sm:space-y-6">
        <PageHeader
          title="Opportunity"
          createButtonText="Create Opportunity"
          onCreateClick={() => {
            setMode("create");
            setEditingOpportunities(null);
            setOpen(true);
          }}
        />

        <PageActions
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        <DataTable
          columns={columns}
          data={opportunities}
          actions={actions}
          emptyMessage="No opportunities found"
        />

        <Pagination
          currentPage={currentPage}
          totalItems={opportunities.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <SlideOver open={open} onClose={() => setOpen(false)} width="max-w-5xl">
        <CreateOpportunity
          mode={mode}
          data={editingOpportunities || undefined}
          onSuccess={handleFormSuccess}
          onClose={() => setOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
