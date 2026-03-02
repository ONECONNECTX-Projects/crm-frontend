"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateProjectForm from "./create/page";
import {
  deleteProject,
  getAllProject,
  Project,
} from "@/app/services/project/project.service";
import { useError } from "@/app/providers/ErrorProvider";
import StatusBadge from "@/app/common/StatusBadge";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

/* ================= Page ================= */

export default function ProjectsPage() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { showSuccess, showError } = useError();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "contact", label: "Contact", visible: true },
    { key: "value", label: "Value", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "company", label: "Company", visible: true },
    { key: "status", label: "Project Status", visible: true },
    { key: "startDate", label: "Start Date", visible: true },
    { key: "deadline", label: "Deadline", visible: true },
  ]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getAllProject();
      setProjects(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= Column Toggle ================= */

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  /* ================= Table Actions ================= */

  const actions: TableAction<Project>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setEditingProject(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => handleDelete(row),
    },
  ];

  /* ================= Columns ================= */

  const tableColumns: TableColumn<Project>[] = [
    {
      key: "id",
      label: "ID",
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
        <div className="font-medium text-gray-900 truncate max-w-[220px]">
          {row.name}
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      visible: columns.find((c) => c.key === "contact")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.contact?.name || "-"}</span>
      ),
    },
    {
      key: "value",
      label: "Value",
      visible: columns.find((c) => c.key === "value")?.visible,
      render: (row) => (
        <span className="font-semibold text-green-600">
          ₹{parseFloat(row.project_value || "0").toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      visible: columns.find((c) => c.key === "priority")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.priority?.name || "-"}</span>
      ),
    },
    {
      key: "company",
      label: "Company",
      visible: columns.find((c) => c.key === "company")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.company?.name || "-"}</span>
      ),
    },
    {
      key: "status",
      label: "Project Status",
      visible: columns.find((c) => c.key === "status")?.visible,
      render: (row) => (
        <StatusBadge status={row.status?.name?.toLowerCase() || "new"} />
      ),
    },
    {
      key: "start_date",
      label: "Start Date",
      visible: columns.find((c) => c.key === "start_date")?.visible,
      render: (row) => (
        <span className="text-gray-600">
          {row.start_date ? new Date(row.start_date).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "deadline",
      label: "Deadline",
      visible: columns.find((c) => c.key === "deadline")?.visible,
      render: (row) => (
        <span className="text-gray-600">
          {row.deadline ? new Date(row.deadline).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  const handleDelete = async (Project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${Project.name}"?`)) {
      try {
        await deleteProject(Project.id);
        showSuccess("Project deleted successfully");
        fetchProjects();
      } catch (error) {
        console.error("Failed to delete Project:", error);
        showError("Failed to delete Project");
      }
    }
  };

  const handleFormSuccess = () => {
    setOpenCreate(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleCloseForm = () => {
    setOpenCreate(false);
    setEditingProject(null);
  };

  const handleCreateClick = () => {
    setEditingProject(null);
    setOpenCreate(true);
  };

  // Custom extractors for nested objects
  const projectExtractors: Record<string, (row: Project) => string> = {
    contact: (row) => row.contact?.name || "-",
    value: (row) =>
      `₹${parseFloat(row.project_value || "0").toLocaleString("en-IN")}`,
    priority: (row) => row.priority?.name || "-",
    status: (row) => row.status?.name || "-",
    startDate: (row) =>
      row.start_date ? new Date(row.start_date).toLocaleDateString() : "-",
    deadline: (row) =>
      row.deadline ? new Date(row.deadline).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredProjects, columns, "projects", projectExtractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredProjects, columns, "Projects", projectExtractors);
  };

  /* ================= Filter + Pagination ================= */

  const filteredProjects = projects.filter((project) =>
    Object.values(project).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase()),
    ),
  );

  const totalItems = filteredProjects.length;

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Projects"
          createButtonText="Create Project"
          onCreateClick={handleCreateClick}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search projects..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
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
      <SlideOver open={openCreate} onClose={handleCloseForm} width="max-w-4xl">
        <CreateProjectForm
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          editingProject={editingProject}
        />
      </SlideOver>
    </div>
  );
}
