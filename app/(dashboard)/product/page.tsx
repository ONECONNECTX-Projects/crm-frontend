"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import { useRouter } from "next/navigation";
import CreateProductForm from "./create/page";

interface Product {
  id: number;
  name: string;
  rate: number;
  unit: number;
  category: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "product-red",
    rate: 100,
    unit: 0,
    category: "product-category-1",
    description: "This is a red product",
  },
  {
    id: 2,
    name: "product-blue",
    rate: 200,
    unit: 0,
    category: "product-category-2",
    description: "This is a blue product",
  },
  {
    id: 3,
    name: "product-green",
    rate: 300,
    unit: 0,
    category: "product-category-3",
    description: "This is a green product",
  },
  {
    id: 4,
    name: "product-yellow",
    rate: 400,
    unit: 0,
    category: "product-category-4",
    description: "This is a yellow product",
  },
  {
    id: 5,
    name: "product-blue",
    rate: 200,
    unit: 0,
    category: "product-category-2",
    description: "This is a blue product",
  },
  {
    id: 6,
    name: "product-green",
    rate: 300,
    unit: 0,
    category: "product-category-3",
    description: "This is a green product",
  },
  {
    id: 7,
    name: "product-yellow",
    rate: 400,
    unit: 0,
    category: "product-category-4",
    description: "This is a yellow product",
  },
];

export default function ProductsPage() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "rate", label: "Rate", visible: true },
    { key: "unit", label: "Unit", visible: true },
    { key: "category", label: "Category", visible: true },
    { key: "description", label: "Description", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<Product>[] = [
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
      onClick: (row) => console.log("Delete product", row),
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Product>[] = columns.map((col) => ({
    key: col.key as keyof Product,
    label: col.label,
    visible: col.visible,
    render: (row) => (
      <span className="truncate block max-w-[300px]">
        {(row as any)[col.key]}
      </span>
    ),
  }));

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Products"
          createButtonText="Create Product"
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
          searchPlaceholder="Search products..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedProducts}
          actions={tableActions}
          emptyMessage="No products found."
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

      {/* SlideOver */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        width="max-w-4xl"
      >
        <CreateProductForm
          mode={mode}
          productId={editingId}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}
