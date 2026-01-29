"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  createProject,
  updateProject,
  Project,
  ProjectPayload,
} from "@/app/services/project/project.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllStaff, Staff } from "@/app/services/staff/staff.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import { getAllActiveProjectStatus } from "@/app/services/project-status/project-status";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";

interface CreateProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingProject?: Project | null;
}

export default function CreateProjectForm({
  onClose,
  onSuccess,
  editingProject,
}: CreateProjectFormProps) {
  const { showSuccess, showError } = useError();
  const isEditMode = !!editingProject;

  const [form, setForm] = useState({
    name: "",
    manager_id: "",
    contact_id: "",
    project_status_id: "",
    priority_id: "",
    project_value: "",
    start_date: "",
    deadline: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<OptionDropDownModel[]>(
    []
  );

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [contactsRes, staffRes, prioritiesRes, statusesRes] =
          await Promise.all([
            getAllActiveContacts(),
            getAllStaff(),
            getAllActivePriority(),
            getAllActiveProjectStatus(),
          ]);

        setContacts(contactsRes.data || []);
        // Map staff to managers dropdown format
        const staffList = staffRes.data || [];
        setManagers(
          staffList.map((s: Staff) => ({
            id: s.user_id,
            name: s.user?.name || "",
          }))
        );
        setPriorities(prioritiesRes.data || []);
        setProjectStatuses(statusesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingProject) {
      setForm({
        name: editingProject.name || "",
        manager_id: editingProject.manager_id?.toString() || "",
        contact_id: editingProject.contact_id?.toString() || "",
        project_status_id: editingProject.project_status_id?.toString() || "",
        priority_id: editingProject.priority_id?.toString() || "",
        project_value: editingProject.project_value || "",
        start_date: editingProject.start_date
          ? new Date(editingProject.start_date).toISOString().split("T")[0]
          : "",
        deadline: editingProject.deadline
          ? new Date(editingProject.deadline).toISOString().split("T")[0]
          : "",
        description: editingProject.description || "",
      });
    }
  }, [editingProject]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showError("Project name is required");
      return;
    }

    setLoading(true);
    try {
      const payload: ProjectPayload = {
        name: form.name,
        manager_id: parseInt(form.manager_id) || 0,
        contact_id: parseInt(form.contact_id) || 0,
        project_status_id: parseInt(form.project_status_id) || 0,
        priority_id: parseInt(form.priority_id) || 0,
        project_value: parseFloat(form.project_value) || 0,
        start_date: form.start_date ? new Date(form.start_date) : new Date(),
        deadline: form.deadline ? new Date(form.deadline) : new Date(),
        description: form.description,
      };

      if (isEditMode && editingProject) {
        await updateProject(editingProject.id, payload);
        showSuccess("Project updated successfully");
      } else {
        await createProject(payload);
        showSuccess("Project created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
      showError(
        isEditMode ? "Failed to update project" : "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">
          {isEditMode ? "Edit Project" : "Create Project"}
        </h2>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* ================= Form ================= */}
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="* Project Name"
          placeholder="Enter Project Name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
        />

        <Select
          label="Project Manager"
          value={form.manager_id}
          options={managers}
          onChange={(v) => handleChange("manager_id", v)}
        />

        <Select
          label="Contact"
          value={form.contact_id}
          options={contacts}
          onChange={(v) => handleChange("contact_id", v)}
        />

        <Select
          label="Project Status"
          value={form.project_status_id}
          options={projectStatuses}
          onChange={(v) => handleChange("project_status_id", v)}
        />

        <Select
          label="Priority"
          value={form.priority_id}
          options={priorities}
          onChange={(v) => handleChange("priority_id", v)}
        />

        <Input
          label="Project Value"
          placeholder="Enter value"
          value={form.project_value}
          onChange={(v) => handleChange("project_value", v)}
        />

        <DateInput
          label="Start Date"
          value={form.start_date}
          onChange={(v) => handleChange("start_date", v)}
        />

        <DateInput
          label="Deadline"
          value={form.deadline}
          onChange={(v) => handleChange("deadline", v)}
        />
      </div>

      {/* ================= Description ================= */}
      <div>
        <label className="text-sm font-medium">Project Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter Project Description"
          rows={4}
          className="w-full mt-1 border rounded-md px-3 py-2"
        />
      </div>

      {/* ================= Footer ================= */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
      >
        {loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Project"
          : "Add Project"}
      </button>
    </div>
  );
}

/* ================= Reusable Fields ================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { id: number; name: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2 bg-white"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2"
      />
    </div>
  );
}