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

  // 1. Initial Columns State (Keys here must match keys in tableColumns checks)
  const [columns, setColumns] = useState([
    { key: "sNo", label: "S.No", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone number", visible: true },
    { key: "owner", label: "Owner", visible: true },
    { key: "company_type", label: "Type", visible: true },
    { key: "company_size", label: "Size", visible: true },
    { key: "annual_revenue", label: "Annual Revenue", visible: true },
    { key: "industry", label: "Industry", visible: true },
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
        showSuccess("Company deleted successfully");
        fetchCompany();
      } catch (error) {
        console.error("Failed to delete company:", error);
        showError("Failed to delete company");
      }
    }
  };

  const handleFormSuccess = () => {
    setOpenCreate(false);
    fetchCompany();
  };

  const actions: TableAction<Company>[] = [
    { label: "View", onClick: (row) => router.push(`/company/${row.id}`) },
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

  // 2. Table Column Definitions with Fixed Visibility Keys
  const tableColumns: TableColumn<Company & { sNo: number }>[] = [
    {
      key: "sNo",
      label: "S.No",
      visible: columns.find((c) => c.key === "sNo")?.visible,
      render: (row) => (
        <span className="font-medium text-gray-500">{row.sNo}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      visible: columns.find((c) => c.key === "name")?.visible,
      render: (row) => (
        <span className="font-medium text-brand-500">{row.name}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      visible: columns.find((c) => c.key === "email")?.visible,
      render: (row) => (
        <span className="text-gray-900">{row.email || "-"}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      visible: columns.find((c) => c.key === "phone")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row?.phone || "-"}</span>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      visible: columns.find((c) => c.key === "owner")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.owner?.name || "-"}</span>
      ),
    },
    {
      key: "company_type",
      label: "Company Type",
      visible: columns.find((c) => c.key === "company_type")?.visible,
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
        <span className="text-gray-700">{row?.industry?.name || "-"}</span>
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

  // 3. Serial Number Injection based on Pagination
  const paginated = filtered
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .map((item, index) => ({
      ...item,
      sNo: (currentPage - 1) * pageSize + index + 1,
    }));

  return (
    <div className="min-h-screen bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="Company"
          createButtonText="Create Company"
          onCreateClick={() => {
            setMode("create");
            setEditingCompany(null);
            setOpenCreate(true);
          }}
        />

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

        <DataTable
          columns={tableColumns}
          data={paginated}
          actions={actions}
          emptyMessage="No companies found."
        />

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
          />
        </SlideOver>
      </div>
    </div>
  );
}
