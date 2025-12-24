"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import Pagination from "@/app/common/pagination";
import SlideOver from "@/app/common/slideOver";
import InputField from "@/app/common/InputFeild";

interface Award {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

interface AwardForm {
  name: string;
  description: string;
}

/* ---------- Dummy Data ---------- */
const awardList: Award[] = [
  {
    id: 1,
    name: "Demo Award",
    description: "Demo Award Description",
    createdAt: "2025-12-24",
  },
];

export default function AwardsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ---------- Column Toggle ---------- */
  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "createdAt", label: "Created at", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  /* ---------- Form State ---------- */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);

  const [formData, setFormData] = useState<AwardForm>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<AwardForm>>({});

  /* ---------- Handlers ---------- */
  const handleOpenCreate = () => {
    setEditingAward(null);
    setFormData({ name: "", description: "" });
    setErrors({});
    setIsSlideOpen(true);
  };

  const handleOpenEdit = (award: Award) => {
    setEditingAward(award);
    setFormData({
      name: award.name,
      description: award.description,
    });
    setErrors({});
    setIsSlideOpen(true);
  };

  const handleCloseSlide = () => {
    setIsSlideOpen(false);
    setEditingAward(null);
    setFormData({ name: "", description: "" });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (errors[name as keyof AwardForm]) {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Partial<AwardForm> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingAward) {
      console.log("UPDATE Award:", { id: editingAward.id, ...formData });
    } else {
      console.log("CREATE Award:", formData);
    }

    handleCloseSlide();
  };

  /* ---------- Table ---------- */
  const tableColumns: TableColumn<Award>[] = columns.map((col) => ({
    key: col.key as keyof Award,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  const tableActions: TableAction<Award>[] = [
    {
      label: "Edit",
      onClick: (row) => handleOpenEdit(row),
    },
  ];

  const filteredAwards = awardList.filter((award) =>
    Object.values(award)
      .join(" ")
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const paginatedAwards = filteredAwards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <PageHeader
        title="Awards"
        createButtonText="Create Award"
        onCreateClick={handleOpenCreate}
      />

      <PageActions
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        columns={columns}
        onColumnToggle={handleColumnToggle}
        onFilterClick={() => {}}
        onPrintPDF={() => {}}
        onDownloadCSV={() => {}}
      />

      <DataTable
        columns={tableColumns}
        data={paginatedAwards}
        actions={tableActions}
        emptyMessage="No awards found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredAwards.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ---------- SlideOver Form ---------- */}
      <SlideOver open={isSlideOpen} onClose={handleCloseSlide}>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">
              {editingAward ? "Edit Award" : "Create Award"}
            </h2>
            <button
              onClick={handleCloseSlide}
              className="text-gray-500 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Name"
              placeholder="Employee Of The Month"
              value={formData.name}
              onChange={handleChange as any}
              error={errors.name}
            />

            <InputField
              label="Description"
              placeholder="Employee Who Performed Well"
              value={formData.description}
              onChange={handleChange as any}
              multiline
              rows={4}
            />

            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              {editingAward ? "Update Award" : "Add Award"}
            </button>
          </form>
        </div>
      </SlideOver>
    </div>
  );
}
