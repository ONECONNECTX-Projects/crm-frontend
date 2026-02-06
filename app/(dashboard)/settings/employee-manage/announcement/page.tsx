"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import Pagination from "@/app/common/pagination";
import SlideOver from "@/app/common/slideOver";
import InputField from "@/app/common/InputFeild";
import AnnouncementForm from "./create/Form";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

interface Announcement {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface AnnouncementForm {
  title: string;
  description: string;
  priority: string;
  status: string;
}

const announcementList: Announcement[] = [
  {
    id: 1,
    title: "System Maintenance",
    description: "Scheduled maintenance on Sunday",
    priority: "high",
    status: "active",
    createdAt: "2025-12-17",
  },
  {
    id: 2,
    title: "Holiday Notice",
    description: "Office closed for holidays",
    priority: "medium",
    status: "active",
    createdAt: "2025-12-15",
  },
  {
    id: 3,
    title: "New Feature Release",
    description: "New dashboard features available",
    priority: "low",
    status: "draft",
    createdAt: "2025-12-10",
  },
];

export default function AnnouncementPage() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const [formData, setFormData] = useState<AnnouncementForm>({
    title: "",
    description: "",
    priority: "medium",
    status: "draft",
  });

  const [errors, setErrors] = useState<Partial<AnnouncementForm>>({});

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created at", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "draft",
    });
    setErrors({});
    setIsSlideOpen(true);
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      priority: announcement.priority,
      status: announcement.status,
    });
    setErrors({});
    setIsSlideOpen(true);
  };

  const handleCloseSlide = () => {
    setIsSlideOpen(false);
    setEditingAnnouncement(null);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "draft",
    });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof AnnouncementForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors: Partial<AnnouncementForm> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      if (editingAnnouncement) {
        console.log("Update announcement:", {
          id: editingAnnouncement.id,
          ...formData,
        });
      } else {
        console.log("Create announcement:", formData);
      }
      handleCloseSlide();
    }
  };

  const tableActions: TableAction<Announcement>[] = [
    {
      label: "Edit",
      onClick: (row) => handleOpenEdit(row),
    },
    {
      label: "Delete",
      onClick: (row) => console.log("Delete", row.id),
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Announcement>[] = columns.map((col) => ({
    key: col.key as keyof Announcement,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  const filteredAnnouncements = announcementList.filter((announcement) =>
    Object.values(announcement).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredAnnouncements.length;

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDownloadExcel = () => {
    downloadExcel(filteredAnnouncements, columns, "announcements");
  };

  const handlePrintPDF = () => {
    printPDF(filteredAnnouncements, columns, "Announcements");
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Announcements"
          createButtonText="Create Announcement"
          onCreateClick={handleOpenCreate}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search announcements..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedAnnouncements}
          actions={tableActions}
          emptyMessage="No announcements found."
        />
      </div>

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

      {/* Slide Over Form */}
      <SlideOver open={isSlideOpen} onClose={handleCloseSlide}>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingAnnouncement
                ? "Edit Announcement"
                : "Create Announcement"}
            </h2>
            <button
              onClick={handleCloseSlide}
              className="text-gray-500 text-2xl"
            >
              &times;
            </button>
          </div>

          <AnnouncementForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEditMode={!!editingAnnouncement}
            onCancel={handleCloseSlide}
          />
        </div>
      </SlideOver>
    </div>
  );
}
