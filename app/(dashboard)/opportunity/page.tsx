"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import Pagination from "@/app/common/pagination";
import SlideOver from "@/app/common/slideOver";
import CreateOpportunity from "./create/page";

interface Opportunity {
  id: number;
  name: string;
  owner: string;
  amount: number;
  company: string;
  stage: string;
  type: string;
  source: string;
  createdAt: string;
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    name: "Test Opportunity",
    owner: "John Doe",
    amount: 1000,
    company: "Company Name",
    stage: "Prospect",
    type: "New Business",
    source: "Website",
    createdAt: "Dec 17, 2025",
  },
];

export default function OpportunityPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Name", visible: true },
    { key: "owner", label: "Owner", visible: true },
    { key: "amount", label: "Amount", visible: true },
    { key: "company", label: "Company", visible: true },
    { key: "stage", label: "Stage", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "source", label: "Source", visible: true },
    { key: "createdAt", label: "Create date", visible: true },
  ]);

  const actions: TableAction<Opportunity>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/opportunity/${row.id}`),
    },
    {
      label: "Edit",
      onClick: () => setOpen(true),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("delete", row),
    },
  ];

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <div className="min-h-screen bg-white rounded-xl  p-6">
      <div className="max-w-9xl mx-auto space-y-6">
        <PageHeader
          title="Opportunity"
          createButtonText="Create Opportunity"
          onCreateClick={() => setOpen(true)}
        />

        <PageActions
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search"
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
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
        <CreateOpportunity onClose={() => setOpen(false)} />
      </SlideOver>
    </div>
  );
}
