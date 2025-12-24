"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateContactForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useRouter } from "next/navigation";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  owner: string;
  source: string;
  stage: string;
  industry: string;
  createdAt: string;
}

const contacts: Contact[] = [
  {
    id: 1,
    name: "Sara Khan",
    email: "sara.khan@greenfields.example",
    phone: "5550003303",
    company: "GreenFields Agro",
    owner: "Mrs. Manager",
    source: "Email Campaign",
    stage: "Lead",
    industry: "Biotechnology",
    createdAt: "Dec 12, 2025",
  },
  {
    id: 2,
    name: "Carlos Mendez",
    email: "carlos.mendez@technova.example",
    phone: "5550002202",
    company: "TechNova Inc",
    owner: "Mr. Customer",
    source: "Social Media",
    stage: "Prospect",
    industry: "Automotive",
    createdAt: "Dec 12, 2025",
  },
  {
    id: 3,
    name: "Aisha Rahman",
    email: "aisha.rahman@omegacorp.example",
    phone: "5550001101",
    company: "Omega Corp",
    owner: "Mr. Admin",
    source: "Website",
    stage: "Lead",
    industry: "Banking & Finance",
    createdAt: "Dec 11, 2025",
  },
  {
    id: 4,
    name: "John Doe",
    email: "john.doe@alphatech.example",
    phone: "5550004404",
    company: "AlphaTech",
    owner: "John Doe",
    source: "Referral",
    stage: "Customer",
    industry: "Information Technology",
    createdAt: "Dec 10, 2025",
  },
  {
    id: 5,
    name: "Priya Sharma",
    email: "priya.sharma@healthplus.example",
    phone: "5550005505",
    company: "HealthPlus",
    owner: "Ms. Lead",
    source: "Website",
    stage: "Prospect",
    industry: "Healthcare",
    createdAt: "Dec 10, 2025",
  },
  {
    id: 6,
    name: "Mohammed Ali",
    email: "m.ali@logix.example",
    phone: "5550006606",
    company: "Logix Transport",
    owner: "Mr. Ops",
    source: "Cold Call",
    stage: "Lead",
    industry: "Logistics",
    createdAt: "Dec 9, 2025",
  },
  {
    id: 7,
    name: "Emily Watson",
    email: "emily.watson@creativehub.example",
    phone: "5550007707",
    company: "Creative Hub",
    owner: "Ms. Creative",
    source: "Instagram",
    stage: "Prospect",
    industry: "Marketing",
    createdAt: "Dec 9, 2025",
  },
  {
    id: 8,
    name: "Rohit Verma",
    email: "rohit.verma@buildmax.example",
    phone: "5550008808",
    company: "BuildMax",
    owner: "Mr. Builder",
    source: "Trade Show",
    stage: "Lead",
    industry: "Construction",
    createdAt: "Dec 8, 2025",
  },
  {
    id: 9,
    name: "Sophia Lee",
    email: "sophia.lee@finserve.example",
    phone: "5550009909",
    company: "FinServe",
    owner: "Ms. Finance",
    source: "LinkedIn",
    stage: "Customer",
    industry: "Finance",
    createdAt: "Dec 8, 2025",
  },
  {
    id: 10,
    name: "David Miller",
    email: "david.miller@edutech.example",
    phone: "5550010010",
    company: "EduTech",
    owner: "Mr. Education",
    source: "Website",
    stage: "Prospect",
    industry: "Education",
    createdAt: "Dec 7, 2025",
  },
];

export default function ContactsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const [columns, setColumns] = useState([
    { key: "name", label: "Name", visible: true },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone Number", visible: true },
    { key: "owner", label: "Owner", visible: true },
    { key: "company", label: "Company", visible: true },
    { key: "source", label: "Source", visible: true },
    { key: "stage", label: "Stage", visible: true },
    { key: "industry", label: "Industry", visible: true },
    { key: "createdAt", label: "Create Date", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
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
        setEditingId(row.id);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => console.log("Delete", row),
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Contact>[] = columns.map((col) => ({
    key: col.key as keyof Contact,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  const filteredContacts = contacts.filter((contact) =>
    Object.values(contact).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredContacts.length;
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Contacts"
          createButtonText="Create Contact"
          onCreateClick={() => {
            setMode("create");
            setEditingId(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search contacts..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedContacts}
          actions={tableActions}
          emptyMessage="No contacts found."
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1); // very important
        }}
      />

      {/* SlideOver with Stepper Form */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        width="max-w-4xl"
      >
        <CreateContactForm mode={mode} onClose={() => setOpenCreate(false)} />
      </SlideOver>
    </div>
  );
}
