"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateCompanyForm from "./create/page";
import { useRouter } from "next/navigation";
import {
  Company,
  deleteCompany,
  getAllCompany,
} from "@/app/services/company/company.service";
import { useError } from "@/app/providers/ErrorProvider";

export default function CompanyPage() {
  const { showSuccess, showError } = useError();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [companies, setCompanyList] = useState<Company[]>([]);

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [columns, setColumns] = useState([
    {
      key: "name",
      label: "Name",
      visible: true,
    },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone number", visible: true },
    {
      key: "owner",
      label: "Owner",
      visible: true,
    },
    {
      key: "company_type",
      label: "Type",
      visible: true,
    },
    { key: "company_size", label: "Size", visible: true },
    {
      key: "annual_revenue",
      label: "Annual Revenue",
      visible: true,
    },
    {
      key: "industry",
      label: "Industry",
      visible: true,
    },
  ]);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await getAllCompany();
      setCompanyList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Company:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleDelete = async (company: Company) => {
    if (window.confirm(`Are you sure you want to delete "${company?.name}"?`)) {
      try {
        await deleteCompany(company.id);
        showSuccess("Staff deleted successfully");
        fetchCompany();
      } catch (error) {
        console.error("Failed to delete staff:", error);
        showError("Failed to delete staff");
      }
    }
  };

  const handleFormSuccess = () => {
    setOpenCreate(false);
    fetchCompany();
  };

  const actions: TableAction<Company>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/company/${row.id}`),
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingCompany(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => handleDelete(row),
    },
  ];

  const tableColumns: TableColumn<Company>[] = [
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
      visible: columns.find((c) => c.key === "employee_code")?.visible,
      render: (row) => (
        <span className="font-medium text-brand-500">{row.name}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      visible: columns.find((c) => c.key === "email")?.visible,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      visible: columns.find((c) => c.key === "email")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row?.phone || "-"}</span>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      visible: columns.find((c) => c.key === "owner")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.owner.name || "-"}</span>
      ),
    },
    {
      key: "companyType",
      label: "Company Type",
      visible: columns.find((c) => c.key === "companyType")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.company_type?.name || "-"}</span>
      ),
    },
    {
      key: "company_size",
      label: "Company Size",
      visible: columns.find((c) => c.key === "company_size")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.company_size || "-"}</span>
      ),
    },
    {
      key: "annual_revenue",
      label: "Annual Revenue",
      visible: columns.find((c) => c.key === "annual_revenue")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.annual_revenue || "-"}</span>
      ),
    },
    {
      key: "industry",
      label: "Industry Name",
      visible: columns.find((c) => c.key === "industry")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.industry.name || "-"}</span>
      ),
    },
  ];

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const filtered = companies.filter((c) =>
    Object.values(c)
      .join(" ")
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Company"
          createButtonText="Create Company"
          onCreateClick={() => {
            setMode("create");
            setEditingCompany(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={(v) => {
            setSearchValue(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginated}
          actions={actions}
          emptyMessage="No companies found."
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />

        <SlideOver
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          width="max-w-4xl"
        >
          <CreateCompanyForm
            mode={mode}
            data={editingCompany || undefined}
            onClose={() => setOpenCreate(false)}
            onSuccess={handleFormSuccess}
          />{" "}
        </SlideOver>
      </div>
    </div>
  );
}
