"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import StatusBadge from "@/app/common/StatusBadge";
import { useRouter } from "next/navigation";
import SlideOver from "@/app/common/slideOver";
import CreateLeadPage from "./create/page";
import CreateLeadForm from "./create/page";
import Pagination from "@/app/common/pagination";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  owner: string;
  status: string;
  value: string;
  source: string;
  convert: string;
}

const leads: Lead[] = [
  {
    id: 1,
    name: "Emily Brown",
    email: "emily.brown@example.com",
    phone: "+1555004444",
    owner: "Mr. Salesman",
    status: "lost",
    value: "18000",
    source: "Cold Call",
    convert: "Not Converted",
  },
  {
    id: 2,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1555003333",
    owner: "Mr. Salesman",
    status: "qualified",
    value: "5000",
    source: "Email Campaign",
    convert: "Not Converted",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "working",
    value: "25000",
    source: "Referral",
    convert: "Not Converted",
  },
  {
    id: 4,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1555001111",
    owner: "Mr. Admin",
    status: "new",
    value: "10000",
    source: "Web",
    convert: "Not Converted",
  },
    {
    id: 5,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "working",
    value: "25000",
    source: "Referral",
    convert: "Not Converted",
  },
  {
    id: 6,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1555001111",
    owner: "Mr. Admin",
    status: "new",
    value: "10000",
    source: "Web",
    convert: "Not Converted",
  },
    {
    id: 7,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "working",
    value: "25000",
    source: "Referral",
    convert: "Not Converted",
  },
  {
    id: 8,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1555001111",
    owner: "Mr. Admin",
    status: "new",
    value: "10000",
    source: "Web",
    convert: "Not Converted",
  },
    {
    id: 9,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "working",
    value: "25000",
    source: "Referral",
    convert: "Not Converted",
  },
  {
    id: 10,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1555001111",
    owner: "Mr. Admin",
    status: "new",
    value: "10000",
    source: "Web",
    convert: "Not Converted",
  },
    {
    id: 11,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "working",
    value: "25000",
    source: "Referral",
    convert: "Not Converted",
  },
  {
    id: 12,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1555001111",
    owner: "Mr. Admin",
    status: "new",
    value: "10000",
    source: "Web",
    convert: "Not Converted",
  },
    {
    id: 13,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "working",
    value: "25000",
    source: "Referral",
    convert: "Not Converted",
  },
  {
    id: 14,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1555001111",
    owner: "Mr. Admin",
    status: "new",
    value: "10000",
    source: "Web",
    convert: "Not Converted",
  },
];

export default function LeadsPage() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
const [mode, setMode] = useState<"create" | "edit">("create");
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "id", label: "Id", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone Number", visible: true },
    { key: "owner", label: "Lead Owner", visible: true },
    { key: "status", label: "Lead Status", visible: true },
    { key: "value", label: "Lead Value", visible: true },
    { key: "source", label: "Lead Source", visible: true },
    { key: "convert", label: "Convert Status", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableColumns: TableColumn<Lead>[] = [
    {
      key: "id",
      label: "Id",
      visible: columns.find((c) => c.key === "id")?.visible,
      render: (row) => <span className="font-medium text-gray-900">#{row.id}</span>,
    },
    {
      key: "name",
      label: "Name",
      visible: columns.find((c) => c.key === "name")?.visible,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      visible: columns.find((c) => c.key === "email")?.visible,
      render: (row) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      key: "phone",
      label: "Phone",
      visible: columns.find((c) => c.key === "phone")?.visible,
      render: (row) => <span className="text-gray-600">{row.phone}</span>,
    },
    {
      key: "owner",
      label: "Lead Owner",
      visible: columns.find((c) => c.key === "owner")?.visible,
      render: (row) => <span className="text-gray-700">{row.owner}</span>,
    },
    {
      key: "status",
      label: "Status",
      visible: columns.find((c) => c.key === "status")?.visible,
      render: (row) => <StatusBadge status={row.status} variant="lead" />,
    },
    {
      key: "value",
      label: "Value",
      visible: columns.find((c) => c.key === "value")?.visible,
      render: (row) => (
        <span className="font-semibold text-green-600">${parseInt(row.value).toLocaleString()}</span>
      ),
    },
    {
      key: "source",
      label: "Source",
      visible: columns.find((c) => c.key === "source")?.visible,
      render: (row) => <span className="text-gray-600">{row.source}</span>,
    },
    {
      key: "convert",
      label: "Convert Status",
      visible: columns.find((c) => c.key === "convert")?.visible,
      render: (row) => (
        <span className="text-gray-500 text-sm italic">{row.convert}</span>
      ),
    },
  ];

  const tableActions: TableAction<Lead>[] = [
   {
  label: "View Details",
  onClick: (row) => {
    router.push(`/leads/${row.id}`);
  },
},
   {
  label: "Edit",
  onClick: (row) => {
    setMode("edit");
    setEditingLead(row);
    setOpenCreate(true);
  },
},
    {
      label: "Delete",
      onClick: (row) => console.log("Delete", row),
      variant: "destructive",
    },
  ];

  // Filter leads based on search
const filteredLeads = leads.filter((lead) =>
  Object.values(lead).some((value) =>
    value.toString().toLowerCase().includes(searchValue.toLowerCase())
  )
);

const totalItems = filteredLeads.length;
const totalPages = Math.ceil(totalItems / pageSize);

const safePage = Math.max(1, Math.min(currentPage, totalPages));

const startIndex = (safePage - 1) * pageSize;
const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

const handlePageChange = (page: number) => {
  setCurrentPage(Math.max(1, Math.min(page, totalPages)));
};
  return (
    <>
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="max-w-9xl mx-auto space-y-6">
        <PageHeader
          title="Leads"
          createButtonText="Create Lead"
 onCreateClick={() => {
    setMode("create");
    setEditingLead(null);
    setOpenCreate(true);
  }}    />

        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search leads by name, email, phone..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => console.log("Filter clicked")}
          onPrintPDF={() => console.log("Print PDF")}
          onDownloadCSV={() => console.log("Download CSV")}
        />

      <DataTable
  columns={tableColumns}
  data={paginatedLeads}
  actions={tableActions}
  emptyMessage="No leads found. Create your first lead to get started!"
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
    </div>
<SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
  <CreateLeadForm 
    mode={mode}
    data={editingLead}
    onClose={() => setOpenCreate(false)} 
  />
</SlideOver>
    </>
  );
  
}

