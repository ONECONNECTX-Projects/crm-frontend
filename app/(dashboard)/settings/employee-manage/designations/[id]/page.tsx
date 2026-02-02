"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import SlideOver from "@/app/common/slideOver";
import CreateDesignationForm from "../create/page";
import DataTable, { TableColumn } from "@/app/common/DataTable";
import PageActions from "@/app/common/PageActions";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

/* ---------------- TYPES ---------------- */

interface DesignationDetails {
  id: number;
  name: string;
  department: string;
  createdAt: string;
}

interface EmployeeRow {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  salary: string;
}

/* ---------------- MOCK DATA ---------------- */

const mockDesignation: DesignationDetails = {
  id: 1,
  name: "Manager",
  department: "Operations",
  createdAt: "Jan 15, 2024",
};

/* Empty list for now (CSV data later) */
const employees: EmployeeRow[] = [];

/* Table columns */

/* ---------------- PAGE ---------------- */

export default function ViewDesignationPage() {
  const router = useRouter();
  const params = useParams();
  const [searchValue, setSearchValue] = useState("");

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "User Name", visible: true },
    { key: "role", label: "Role", visible: true },
    { key: "email", label: "email", visible: true },
    { key: "phone", label: "phone", visible: true },
    { key: "salary", label: "salary", visible: true },
  ]);
  const [designation, setDesignation] = useState<DesignationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setDesignation(mockDesignation);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!designation) {
    return (
      <div className="bg-white rounded-xl p-6">
        <p className="text-sm text-gray-500">Designation not found</p>
      </div>
    );
  }

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const filteredEmployees = employees.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const handleDownloadExcel = () => {
    downloadExcel(filteredEmployees, columns, "designation-employees");
  };

  const handlePrintPDF = () => {
    printPDF(filteredEmployees, columns, `Employees - ${designation.name}`);
  };

  const tableColumns: TableColumn<EmployeeRow>[] = columns.map((col) => ({
    key: col.key as keyof EmployeeRow,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  return (
    <div className="bg-white rounded-xl p-6 space-y-8">
      {/* HEADER (UNCHANGED) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {designation.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Created on {designation.createdAt}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() =>
              router.push("/settings/employee-manage/designations")
            }
          >
            Back to Designations
          </Button>

          <Button
            onClick={() => {
              setMode("edit");
              setEditingId(designation.id);
              setOpenCreate(true);
            }}
          >
            Edit Designation
          </Button>
        </div>
      </div>

      {/* ================= LIST SECTION (NEW) ================= */}
      <div className="space-y-4">
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search employees..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />
        <DataTable
          columns={tableColumns}
          data={filteredEmployees}
          emptyMessage="Empty"
        />{" "}
      </div>

      {/* SLIDEOVER (UNCHANGED) */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        width="max-w-2xl"
      >
        <CreateDesignationForm
          mode={mode}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}
