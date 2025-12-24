"use client";

import InputField from "@/app/common/InputFeild";

interface AnnouncementFormProps {
  formData: {
    title: string;
    description: string;
    priority: string;
    status: string;
  };
  errors: Partial<any>;
  onChange: (e: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditMode: boolean;
  onCancel: () => void;
}

export default function AnnouncementForm({
  formData,
  errors,
  onChange,
  onSubmit,
  isEditMode,
  onCancel,
}: AnnouncementFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <InputField
        label="Title"
        placeholder="Meeting at 00:00"
        value={formData.title}
        onChange={onChange}
        error={errors.title}
        noLeadingSpace
      />

      <InputField
        label="Description"
        placeholder="Description"
        value={formData.description}
        onChange={onChange}
        error={errors.description}
        multiline
        rows={5}
        noLeadingSpace
      />

      <div>
        <label className="block mb-1 font-medium text-gray-700">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={onChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          {isEditMode ? "Update Announcement" : "Add Announcement"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
