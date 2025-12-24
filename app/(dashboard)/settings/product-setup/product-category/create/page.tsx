"use client";

import { useEffect, useState } from "react";

interface Props {
  mode: "create" | "edit";
  ProductCategoryId: number | null;
  onClose: () => void;
}

export default function CreateProductCategoryForm({
  mode,
  ProductCategoryId,
  onClose,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (mode === "edit" && ProductCategoryId) {
      // fetch by id (mock)
      setName("Private");
    }
  }, [mode, ProductCategoryId]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (mode === "edit") {
      console.log("UPDATE Product Category", { ProductCategoryId, name });
    } else {
      console.log("CREATE Product Category", { name });
    }

    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold">
          {mode === "edit"
            ? "Edit Product Category"
            : "Create Product Category"}
        </h2>
        <button onClick={onClose} className="text-xl">
          ✕
        </button>
      </div>

      {/* Form */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Product Category Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Category name"
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        {mode === "edit" ? "Update" : "Create"}
      </button>
    </div>
  );
}
