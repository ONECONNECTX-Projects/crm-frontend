"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateContactForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useRouter } from "next/navigation";
import {
  getAllContacts,
  deleteContact,
  Contact,
} from "@/app/services/contact/contact.service";
import { useError } from "@/app/providers/ErrorProvider";

export default function ContactsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useError();

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone Number", visible: true },
    { key: "owner", label: "Owner", visible: true },
    { key: "company", label: "Company", visible: true },
    { key: "source", label: "Source", visible: true },
    { key: "stage", label: "Stage", visible: true },
    { key: "industry", label: "Industry", visible: true },
    { key: "created_at", label: "Create Date", visible: true },
  ]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await getAllContacts();
      setContactList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const handleDelete = async (contact: Contact) => {
    const fullName = `${contact.first_name} ${contact.last_name}`;
    if (window.confirm(`Are you sure you want to delete "${fullName}"?`)) {
      try {
        await deleteContact(contact.id);
        showSuccess("Contact deleted successfully");
        fetchContacts();
      } catch (error) {
        console.error("Failed to delete contact:", error);
        showError("Failed to delete contact");
      }
    }
  };

  const handleFormSuccess = () => {
    setOpenCreate(false);
    fetchContacts();
  };

  const tableActions: TableAction<Contact>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/contact/${row.id}`);
      },
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingContact(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => handleDelete(row),
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Contact>[] = [
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
        <div>
          <div className="font-medium text-gray-900">
            {row.first_name} {row.last_name}
          </div>
          <div className="text-xs text-gray-500">{row.job_title || "-"}</div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      visible: columns.find((c) => c.key === "email")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.email || "-"}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone Number",
      visible: columns.find((c) => c.key === "phone")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.phone || "-"}</span>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      visible: columns.find((c) => c.key === "owner")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.owner?.name || "-"}</span>
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
      key: "source",
      label: "Source",
      visible: columns.find((c) => c.key === "source")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.source?.name || "-"}</span>
      ),
    },
    {
      key: "stage",
      label: "Stage",
      visible: columns.find((c) => c.key === "stage")?.visible,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.stage?.name || "-"}
        </span>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      visible: columns.find((c) => c.key === "industry")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.industry?.name || "-"}</span>
      ),
    },
    {
      key: "created_at",
      label: "Create Date",
      visible: columns.find((c) => c.key === "created_at")?.visible,
      render: (row) => (
        <span className="text-gray-600">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  const filteredContacts = contactList.filter((contact) => {
    const searchLower = searchValue.toLowerCase();
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.phone?.toLowerCase().includes(searchLower) ||
      contact.company?.name?.toLowerCase().includes(searchLower) ||
      contact.owner?.name?.toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (safePage - 1) * pageSize;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        <PageHeader
          title="Contacts"
          createButtonText="Create Contact"
          onCreateClick={() => {
            setMode("create");
            setEditingContact(null);
            setOpenCreate(true);
          }}
        />

        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search contacts by name, email, phone..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        <DataTable
          columns={tableColumns}
          data={paginatedContacts}
          actions={tableActions}
          emptyMessage="No contacts found. Add your first contact to get started!"
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        width="sm:w-[70vw] lg:w-[60vw]"
      >
        <CreateContactForm
          mode={mode}
          data={editingContact || undefined}
          onClose={() => setOpenCreate(false)}
          onSuccess={handleFormSuccess}
        />
      </SlideOver>
    </div>
  );
}
