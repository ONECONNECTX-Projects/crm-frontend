"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateProjectForm from "./create/page";

/* ================= Types ================= */

interface Project {
  id: number;
  name: string;
  contact: string;
  value: number;
  priority: string;
  status: string;
  startDate: string;
  deadline: string;
}

/* ================= Mock Data ================= */

const projects: Project[] = [
  {
    id: 1,
    name: "TEST",
    contact: "CARLOS MENDEZ",
    value: 34,
    priority: "Highest",
    status: "in-progress",
    startDate: "Dec 10, 2025",
    deadline: "-",
  },
];

/* ================= Page ================= */

export default function ProjectsPage() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "contact", label: "Contact", visible: true },
    { key: "value", label: "Value", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "status", label: "Project Status", visible: true },
    { key: "startDate", label: "Start Date", visible: true },
    { key: "deadline", label: "Deadline", visible: true },
  ]);

  /* ================= Column Toggle ================= */

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  /* ================= Table Actions ================= */

  const actions: TableAction<Project>[] = [
    {
      label: "Edit",
      onClick: () => setOpenCreate(true),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("delete project", row),
    },
  ];

  /* ================= Columns ================= */

  const tableColumns: TableColumn<Project>[] = columns.map((col) => ({
    key: col.key as keyof Project,
    label: col.label,
    visible: col.visible,
    render: (row) => (
      <span className="truncate block max-w-[200px]">
        {(row as any)[col.key]}
      </span>
    ),
  }));

  /* ================= Filter + Pagination ================= */

  const filteredProjects = projects.filter((project) =>
    Object.values(project).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredProjects.length;

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Projects"
          createButtonText="Create Project"
          onCreateClick={() => setOpenCreate(true)}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search projects..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedProjects}
          actions={actions}
          emptyMessage="No projects found"
        />

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
      </div>

      {/* SlideOver */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        width="max-w-4xl"
      >
        <CreateProjectForm onClose={() => setOpenCreate(false)} />
      </SlideOver>
    </div>
  );
}
