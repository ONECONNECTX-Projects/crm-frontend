"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  createProductCategory,
  ProductCategory,
  updateProductCategory,
} from "@/app/services/product-category/product-category.service";

interface CreateProductCategoryFormProps {
  mode: "create" | "edit";
  ProductCategoryData?: ProductCategory | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateProductCategoryForm({
  mode,
  ProductCategoryData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateProductCategoryFormProps) {
  const { showSuccess, showError } = useError();
  const [ProductCategoryName, setProductCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && ProductCategoryData) {
      setProductCategoryName(ProductCategoryData.name || "");
    } else {
      setProductCategoryName("");
    }
  }, [mode, ProductCategoryData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!ProductCategoryName.trim()) {
      showError("Please enter a Product Category name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && ProductCategoryData?.id) {
        await updateProductCategory(ProductCategoryData.id, {
          name: ProductCategoryName,
        });
        showSuccess("Product Category updated successfully");
      } else {
        await createProductCategory({ name: ProductCategoryName });
        showSuccess("Product Category created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Product Category:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      {!popUp && (
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "edit"
              ? "Edit Product Category"
              : "Create Product Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ProductCategoryName}
            onChange={(e) => setProductCategoryName(e.target.value)}
            placeholder="Enter Product Category name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        {!popUp && (
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Product Category"
              : "Create Product Category"}
        </Button>
      </div>
    </div>
  );
}
