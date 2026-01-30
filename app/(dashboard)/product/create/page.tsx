"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import {
  createProduct,
  Product,
  ProductPayload,
  updateProduct,
} from "@/app/services/product/product.service";
import { getAllActiveProductCategory } from "@/app/services/product-category/product-category.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import SelectDropdown from "@/app/common/dropdown";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import CreateProductCategoryForm from "../../settings/product-category-setup/create/page";

interface CreateProductFormProps {
  mode?: "create" | "edit";
  data?: Product | undefined;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateProductForm({
  mode = "create",
  data,
  onClose,
  onSuccess,
}: CreateProductFormProps) {
  const { showSuccess, showError } = useError();
  const [formData, setFormData] = useState<ProductPayload>({
    name: "",
    rate: "",
    unit: "",
    category_id: "",
    description: "",
  });
  const [productCategory, setProductCategory] = useState<OptionDropDownModel[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);

  const [openProductCategoryModal, setOpenProductCategoryModal] =
    useState(false);
  // Load data on edit
  useEffect(() => {
    if (mode === "edit" && data) {
      console.log(data);
      setFormData({
        name: data.name || "",
        category_id: data.category_id || "",
        description: data.description || "",
        rate: data.rate || "",
        unit: data.unit || "",
      });
    } else {
      setFormData({
        name: "",
        rate: "",
        unit: "",
        category_id: "",
        description: "",
      });
    }
  }, [mode, data]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [productRes] = await Promise.all([getAllActiveProductCategory()]);
        setProductCategory(productRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const productData: ProductPayload = {
        name: formData.name,
        description: formData.description,
        rate: formData.rate,
        unit: formData.unit,
        category_id: formData.category_id,
      };

      if (mode === "edit" && data?.id) {
        await updateProduct(data.id, productData);
        showSuccess("Product updated successfully");
      } else {
        await createProduct(productData);
        showSuccess("Product created successfully");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save Product:", error);
      showError(
        mode === "edit"
          ? "Failed to update Product"
          : "Failed to create Product",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">
          {mode === "create" ? "Create Product" : "Edit Product"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-500">*</span> Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rate</label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <input
              type="number"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <SelectDropdown
              value={formData.category_id}
              onChange={(v) => setFormData({ ...formData, category_id: v })}
              options={productCategory.map((productCategory) => ({
                label: productCategory.name,
                value: productCategory.id,
              }))}
              label="Select category"
              onAddClick={() => setOpenProductCategoryModal(true)}
              className="w-full rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></SelectDropdown>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 bg-brand-500 text-white py-2 rounded-md font-medium hover:bg-brand-600 transition disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : mode === "edit"
                ? "Save Changes"
                : "Create Product"}
          </Button>
        </div>
      </form>

      {openProductCategoryModal && (
        <Dialog
          open={openProductCategoryModal}
          onOpenChange={() => setOpenProductCategoryModal(false)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader />
            <CreateProductCategoryForm
              mode={mode}
              onClose={onClose}
              popUp={true}
              onSuccess={async () => {
                setOpenProductCategoryModal(false);

                const res = await getAllActiveProductCategory();
                setProductCategory(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
