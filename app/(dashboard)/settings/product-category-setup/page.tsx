"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateProductCategoryForm from "./create/page";
import Pagination from "@/app/common/pagination";

import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteProductCategory,
  getAllProductCategory,
  ProductCategory,
  updateProductCategoryStatus,
} from "@/app/services/product-category/product-category.service";

export default function ProductCategoryPage() {
  const { showSuccess, showError } = useError();
  const [ProductCategory, setProductCategory] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingProductCategory, setEditingProductCategory] =
    useState<ProductCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Product Category Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch ProductCategory from API
  const fetchProductCategory = async () => {
    setLoading(true);
    try {
      const response = await getAllProductCategory();
      setProductCategory(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Product Category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductCategory();
  }, []);

  const handleStatusToggle = async (
    ProductCategory: ProductCategory,
    newStatus: boolean,
  ) => {
    // Optimistic UI update
    setProductCategory((prev) =>
      prev.map((r) =>
        r.id === ProductCategory.id ? { ...r, is_active: newStatus } : r,
      ),
    );

    try {
      await updateProductCategoryStatus(ProductCategory.id || 0, newStatus);
      showSuccess(
        `Product Category ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      // Rollback if API fails
      setProductCategory((prev) =>
        prev.map((r) =>
          r.id === ProductCategory.id
            ? { ...r, is_active: ProductCategory.is_active }
            : r,
        ),
      );
      showError("Failed to update Product Category status");
    }
  };

  // Handle delete ProductCategory
  const handleDelete = async (ProductCategory: ProductCategory) => {
    if (
      !confirm(`Are you sure you want to delete "${ProductCategory.name}"?`)
    ) {
      return;
    }

    try {
      await deleteProductCategory(ProductCategory.id || 0);
      showSuccess("Product Category deleted successfully");
      fetchProductCategory();
    } catch (error) {
      console.error("Failed to delete Product Category:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchProductCategory();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const tableActions: TableAction<ProductCategory>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingProductCategory(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<ProductCategory>[] = columns.map((col) => ({
    key: col.key as keyof ProductCategory,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      if (col.key === "status") {
        return (
          <Toggle
            checked={row.is_active || false}
            onChange={(checked) => handleStatusToggle(row, checked)}
          />
        );
      }
      if (col.key === "createdAt" && row.created_at) {
        return (
          <span>
            {new Date(row.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      }
      const value = row[col.key as keyof ProductCategory];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredProductCategory = ProductCategory?.filter((ProductCategory) =>
    Object.values(ProductCategory).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase()),
    ),
  );

  const totalItems = filteredProductCategory.length;
  const paginatedProductCategory = filteredProductCategory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Product Category"
          createButtonText="Create Product Category"
          onCreateClick={() => {
            setMode("create");
            setEditingProductCategory(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Product Category..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Product Categories...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedProductCategory}
            actions={tableActions}
            emptyMessage="No Product Category found."
          />
        )}
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

      {/* SlideOver with Form */}
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-lg">
        <CreateProductCategoryForm
          mode={mode}
          ProductCategoryData={editingProductCategory}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
