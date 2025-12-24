"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface ProductCategory {
  id: number;
  name: string;
  code: string;
  description: string;
  parentCategory: string;
  status: "active" | "inactive";
  productsCount: number;
}

const productCategories: ProductCategory[] = [
  {
    id: 1,
    name: "Software",
    code: "SW",
    description: "Software products and licenses",
    parentCategory: "Technology",
    status: "active",
    productsCount: 156,
  },
  {
    id: 2,
    name: "Hardware",
    code: "HW",
    description: "Hardware equipment and devices",
    parentCategory: "Technology",
    status: "active",
    productsCount: 89,
  },
  {
    id: 3,
    name: "Services",
    code: "SVC",
    description: "Professional and consulting services",
    parentCategory: "Services",
    status: "active",
    productsCount: 234,
  },
  {
    id: 4,
    name: "Cloud Solutions",
    code: "CLD",
    description: "Cloud-based software and infrastructure",
    parentCategory: "Software",
    status: "active",
    productsCount: 78,
  },
  {
    id: 5,
    name: "Training",
    code: "TRN",
    description: "Training and educational services",
    parentCategory: "Services",
    status: "active",
    productsCount: 45,
  },
  {
    id: 6,
    name: "Support",
    code: "SUP",
    description: "Technical support and maintenance",
    parentCategory: "Services",
    status: "active",
    productsCount: 123,
  },
  {
    id: 7,
    name: "Networking",
    code: "NET",
    description: "Network equipment and solutions",
    parentCategory: "Hardware",
    status: "active",
    productsCount: 67,
  },
  {
    id: 8,
    name: "Legacy Systems",
    code: "LEG",
    description: "Deprecated legacy products",
    parentCategory: "Software",
    status: "inactive",
    productsCount: 12,
  },
];

const statusColorMap = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function ProductSetupPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof ProductCategory; label: string; visible: boolean }[]
  >([
    { key: "name", label: "Name", visible: true },
    { key: "code", label: "Code", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "parentCategory", label: "Parent Category", visible: true },
    { key: "productsCount", label: "Products", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<ProductCategory>[] = [
    {
      label: "Edit",
      onClick: (row) => console.log("Edit product category", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete product category", row),
    },
  ];

  const filtered = productCategories.filter((category) =>
    `${category.name} ${category.code} ${category.description} ${category.parentCategory}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<ProductCategory>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
      label: col.label,
      visible: col.visible,
      render: (row) => {
        if (col.key === "status") {
          return (
            <StatusBadge
              status={row.status}
              colorMap={statusColorMap}
              variant="default"
            />
          );
        }
        return (
          <span className="truncate block max-w-[200px]">
            {String(row[col.key])}
          </span>
        );
      },
    }));

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <PageHeader
        title="Product Setup"
        createButtonText="Add Product Category"
        onCreateClick={() => setOpenCreate(true)}
      />

      <PageActions
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable
        columns={tableColumns}
        data={paginatedData}
        actions={actions}
        emptyMessage="No product categories found."
      />

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

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Product Category</h2>
          <p className="text-gray-600">
            Product category configuration form will be implemented here.
          </p>
        </div>
      </SlideOver>
    </div>
  );
}