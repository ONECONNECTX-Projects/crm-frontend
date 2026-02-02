"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateProductForm from "./create/page";
import {
  deleteProduct,
  getAllProduct,
  Product,
} from "@/app/services/product/product.service";
import { useError } from "@/app/providers/ErrorProvider";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function ProductsPage() {
  const { showSuccess, showError } = useError();
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [products, setProductList] = useState<Product[]>([]);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "rate", label: "Rate", visible: true },
    { key: "unit", label: "Unit", visible: true },
    {
      key: "category",
      label: "Category",
      visible: true,
    },
    { key: "description", label: "Description", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const tableActions: TableAction<Product>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingProduct(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => handleDelete(row),
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Product>[] = columns.map((col) => ({
    key: col.key as keyof Product,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      const value =
        col.key === "category"
          ? row.category?.name
          : row[col.key as keyof Product];
      return (
        <span className="truncate block max-w-[300px]">
          {String(value ?? "")}
        </span>
      );
    },
  }));

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await getAllProduct();
      setProductList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleDelete = async (Product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${Product?.name}"?`)) {
      try {
        await deleteProduct(Product.id);
        showSuccess("Quote deleted successfully");
        fetchProduct();
      } catch (error) {
        console.error("Failed to delete Quote:", error);
        showError("Failed to delete Quote");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase()),
    ),
  );

  const totalItems = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleFormSuccess = () => {
    setOpenCreate(false);
    fetchProduct();
  };

  // Custom extractors for nested objects
  const productExtractors: Record<string, (row: Product) => string> = {
    category: (row) => row.category?.name || "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredProducts, columns, "products", productExtractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredProducts, columns, "Products", productExtractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Products"
          createButtonText="Create Product"
          onCreateClick={() => {
            setMode("create");
            setEditingProduct(null);
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
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
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
          data={editingProduct || undefined}
          onClose={() => setOpenCreate(false)}
          onSuccess={handleFormSuccess}
        />
      </SlideOver>
    </div>
  );
}
