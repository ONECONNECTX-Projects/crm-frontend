"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import TeamView from "./View/TeamView";
import CreateTeamForm from "./Create/page";
import {
  getAllProjectTeam,
  deleteProjectTeam,
  ProjectTeam,
} from "@/app/services/project-teams/project-teams.service";
import { useError } from "@/app/providers/ErrorProvider";
import StatusBadge from "@/app/common/StatusBadge";

export default function TeamsPage() {
  const { showSuccess, showError } = useError();

  const [openView, setOpenView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ProjectTeam | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const [teams, setTeams] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(false);

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Team Name", visible: true },
    { key: "project", label: "Project", visible: true },
    { key: "members", label: "Members", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  /* Fetch Teams */
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await getAllProjectTeam();
      setTeams(response.data || []);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  /* Column Toggle */
  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  /* Handle Delete */
  const handleDelete = async (team: ProjectTeam) => {
    if (window.confirm(`Are you sure you want to delete "${team.name}"?`)) {
      try {
        await deleteProjectTeam(team.id);
        showSuccess("Team deleted successfully");
        fetchTeams();
      } catch (error) {
        console.error("Failed to delete team:", error);
        showError("Failed to delete team");
      }
    }
  };

  /* Table Actions */
  const actions: TableAction<ProjectTeam>[] = [
    {
      label: "View",
      onClick: (row) => {
        setSelectedTeam(row);
        setOpenView(true);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => handleDelete(row),
    },
  ];

  /* Search Filter */
  const filtered = teams.filter((t) =>
    `${t.id} ${t.name} ${t.project?.name || ""}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  /* Pagination Logic */
  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* DataTable Columns */
  const tableColumns: TableColumn<ProjectTeam>[] = [
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
      label: "Team Name",
      visible: columns.find((c) => c.key === "name")?.visible,
      render: (row) => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      key: "project",
      label: "Project",
      visible: columns.find((c) => c.key === "project")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.project?.name || "-"}</span>
      ),
    },
    {
      key: "members",
      label: "Members",
      visible: columns.find((c) => c.key === "members")?.visible,
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.members && row.members.length > 0 ? (
            <>
              {row.members.slice(0, 2).map((m, i) => (
                <span
                  key={i}
                  className="bg-brand-100 text-brand-600 px-2 py-0.5 rounded text-xs"
                >
                  {m.name}
                </span>
              ))}
              {row.members.length > 2 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                  +{row.members.length - 2} more
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 text-sm">No members</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      visible: columns.find((c) => c.key === "status")?.visible,
      render: (row) => (
        <StatusBadge status={row.is_active ? "active" : "inactive"} />
      ),
    },
  ];

  /* Form Handlers */
  const handleFormSuccess = () => {
    setOpenCreate(false);
    fetchTeams();
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedTeam(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Teams"
        createButtonText="Create Team"
        onCreateClick={() => setOpenCreate(true)}
      />

      {/* Actions */}
      <PageActions
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search teams..."
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      {/* Table */}
      <DataTable
        columns={tableColumns}
        data={paginatedData}
        actions={actions}
        emptyMessage="No teams found."
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

      {/* Create Team */}
      <SlideOver open={openCreate} onClose={handleCloseCreate}>
        <CreateTeamForm onClose={handleCloseCreate} onSuccess={handleFormSuccess} />
      </SlideOver>

      {/* View Team */}
      <SlideOver open={openView} onClose={handleCloseView}>
        {selectedTeam && (
          <TeamView team={selectedTeam} onClose={handleCloseView} />
        )}
      </SlideOver>
    </div>
  );
}
