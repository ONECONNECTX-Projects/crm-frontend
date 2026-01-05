"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateCompanyForm from "./create/page";
import { useRouter } from "next/navigation";

export interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  owner: string;
  type: string;
  size: number | string;
  revenue: number | string;
  industry: string;
}

const companies: Company[] = [
  {
    id: 1,
    name: "fcedf",
    email: "-",
    phone: "-",
    owner: "John Doe",
    type: "-",
    size: "-",
    revenue: "-",
    industry: "-",
  },
  {
    id: 2,
    name: "GreenFields Agro",
    email: "hello@greenfields.example",
    phone: "5550003003",
    owner: "Mrs. Manager",
    type: "Government",
    size: 80,
    revenue: 3200000,
    industry: "Biotechnology",
  },
  {
    id: 3,
    name: "TechNova Inc",
    email: "contact@technova.example",
    phone: "5550002002",
    owner: "Mr. Customer",
    type: "Private",
    size: 200,
    revenue: 15000000,
    industry: "Automotive",
  },
  {
    id: 4,
    name: "Omega Solutions Ltd",
    email: "info@omega-solutions.example",
    phone: "5550001001",
    owner: "Mr. Admin",
    type: "Public",
    size: 50,
    revenue: 2500000,
    industry: "Banking and Finance",
  },
  {
    id: 5,
    name: "Company Name",
    email: "company@gmail.com",
    phone: "1234567890",
    owner: "John Doe",
    type: "Private",
    size: 10,
    revenue: 10000000,
    industry: "Agriculture",
  },
  {
    id: 6,
    name: "Company Name",
    email: "company@gmail.com",
    phone: "1234567890",
    owner: "John Doe",
    type: "Private",
    size: 10,
    revenue: 10000000,
    industry: "Agriculture",
  },
];

export default function CompanyPage() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const router = useRouter();
  const [columns, setColumns] = useState([
    {
      key: "name",
      label: "Name",
      visible: true,
    },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone number", visible: true },
    { key: "owner", label: "Owner", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "size", label: "Size", visible: true },
    {
      key: "revenue",
      label: "Annual Revenue",
      visible: true,
    },
    { key: "industry", label: "Industry", visible: true },
  ]);

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
    { label: "Delete", variant: "destructive", onClick: () => {} },
  ];

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const filtered = companies.filter((c) =>
    Object.values(c).join(" ").toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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
          columns={columns}
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
          <CreateCompanyForm mode={mode} onClose={() => setOpenCreate(false)} />{" "}
        </SlideOver>
      </div>
    </div>
  );
}
