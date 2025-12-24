"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import TeamView from "./View/page";
import CreateTeamForm from "./Create/page";

interface Team {
  id: number;
  project: string;
  teamName: string;
  status: boolean;
  members: { name: string }[];
}

const teams: Team[] = [
  {
    id: 1,
    project: "test",
    teamName: "csc",
    status: true,
    members: [],
  },
  {
    id: 2,
    project: "SC SZ",
    teamName: "x",
    status: true,
    members: [{ name: "Mrs. Delivery" }],
  },
  {
    id: 3,
    project: "Demo",
    teamName: "Alpha",
    status: false,
    members: [],
  },
  {
    id: 4,
    project: "test",
    teamName: "csc",
    status: true,
    members: [],
  },
  {
    id: 5,
    project: "SC SZ",
    teamName: "x",
    status: true,
    members: [{ name: "Mrs. Delivery" }],
  },
  {
    id: 6,
    project: "test",
    teamName: "csc",
    status: true,
    members: [],
  },
  {
    id: 7,
    project: "SC SZ",
    teamName: "x",
    status: true,
    members: [{ name: "Mrs. Delivery" }],
  },
];

export default function TeamsPage() {
  const [openView, setOpenView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchValue, setSearchValue] = useState("");

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof Team; label: string; visible: boolean }[]
  >([
    { key: "id", label: "ID", visible: true },
    { key: "teamName", label: "Team Name", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  /* Column Toggle */
  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  /* Table Actions */
  const actions: TableAction<Team>[] = [
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
      onClick: (row) => console.log("Delete team", row),
    },
  ];

  /* Search Filter */
  const filtered = teams.filter((t) =>
    `${t.id} ${t.teamName} ${t.project}`
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
  const tableColumns: TableColumn<Team>[] = columns.map((col) => ({
    key: col.key,
    label: col.label,
    visible: col.visible,
    render: (row) => (
      <span className="truncate block max-w-[200px]">
        {(row as any)[col.key]}
      </span>
    ),
  }));

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
      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateTeamForm onClose={() => setOpenCreate(false)} />
      </SlideOver>

      {/* View Team */}
      <SlideOver open={openView} onClose={() => setOpenView(false)}>
        {selectedTeam && <TeamView team={selectedTeam} />}
      </SlideOver>
    </div>
  );
}
