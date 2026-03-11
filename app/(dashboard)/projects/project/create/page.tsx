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
import { getAllActiveCompany } from "@/app/services/company/company.service";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import DateInput from "@/app/common/CommonDate";

interface CreateProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  defaultCompanyId?: number;
  editingProject?: Project | null;
}

export default function CreateProjectForm({
  onClose,
  onSuccess,
  defaultCompanyId,
  editingProject,
}: CreateProjectFormProps) {
  const { showSuccess, showError } = useError();
  const isEditMode = !!editingProject;
  const [form, setForm] = useState({
    name: editingProject?.name || "",
    manager_id: editingProject?.manager_id?.toString() || "",
    contact_id: editingProject?.contact_id?.toString() || "",
    project_status_id: editingProject?.project_status_id?.toString() || "",
    priority_id: editingProject?.priority_id?.toString() || "",
    company_id: defaultCompanyId
      ? String(defaultCompanyId)
      : String(editingProject?.company_id || ""),
    project_value: editingProject?.project_value || "",
    start_date: editingProject?.start_date
      ? new Date(editingProject?.start_date).toISOString().split("T")[0]
      : "",
    deadline: editingProject?.deadline
      ? new Date(editingProject?.deadline).toISOString().split("T")[0]
      : "",
    description: editingProject?.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<OptionDropDownModel[]>(
    [],
  );

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [contactsRes, staffRes, prioritiesRes, statusesRes, companyRes] =
          await Promise.all([
            getAllActiveContacts(),
            getAllStaff(),
            getAllActivePriority(),
            getAllActiveProjectStatus(),
            getAllActiveCompany(),
          ]);

        setContacts(contactsRes.data || []);
        const staffList = staffRes.data || [];
        setManagers(
          staffList.map((s: Staff) => ({
            id: s.user_id,
            name: s.user?.name || "",
          })),
        );
        setPriorities(prioritiesRes.data || []);
        setProjectStatuses(statusesRes.data || []);
        setCompanies(companyRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toOptions = (list: { id: number; name: string }[]) =>
    list.map((item) => ({ label: item.name, value: item.id }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showError("Project name is required");
      return;
    }
    if (!form.manager_id) {
      showError("Project Manager is required");
      return;
    }
    if (!form.project_status_id) {
      showError("Project Status is required");
      return;
    }
    if (!form.priority_id) {
      showError("Priority is required");
      return;
    }

    setLoading(true);
    try {
      const payload: ProjectPayload = {
        name: form.name,
        manager_id: parseInt(form.manager_id) || null,
        contact_id: parseInt(form.contact_id) || null,
        project_status_id: parseInt(form.project_status_id) || null,
        priority_id: parseInt(form.priority_id) || null,
        company_id: parseInt(form.company_id) || null,
        project_value: parseFloat(form.project_value) || 0,
        start_date: form.start_date ? new Date(form.start_date) : new Date(),
        deadline: form.deadline ? new Date(form.deadline) : null,
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
        <InputField
          label="Project Name"
          required
          placeholder="Enter Project Name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
        />

        <SelectDropdown
          label="Project Manager"
          value={form.manager_id}
          required
          options={toOptions(managers)}
          placeholder="Select Project Manager"
          onChange={(v) => handleChange("manager_id", v)}
        />

        <SelectDropdown
          label="Contact"
          value={form.contact_id}
          options={toOptions(contacts)}
          placeholder="Select Contact"
          onChange={(v) => handleChange("contact_id", v)}
        />

        <SelectDropdown
          label="Project Status"
          value={form.project_status_id}
          required
          options={toOptions(projectStatuses)}
          placeholder="Select Project Status"
          onChange={(v) => handleChange("project_status_id", v)}
        />

        <SelectDropdown
          label="Priority"
          value={form.priority_id}
          required
          options={toOptions(priorities)}
          placeholder="Select Priority"
          onChange={(v) => handleChange("priority_id", v)}
        />

        <SelectDropdown
          label="Company"
          value={form.company_id}
          options={toOptions(companies)}
          placeholder="Select Company"
          onChange={(v) => handleChange("company_id", v)}
        />

        <InputField
          label="Project Value"
          placeholder="Enter value"
          value={form.project_value}
          onChange={(v) => handleChange("project_value", v)}
        />

        <DateInput
          label="Start Date"
          value={form.start_date}
          onChange={(v) => handleChange("start_date", v || "")}
        />

        <DateInput
          label="Deadline"
          value={form.deadline}
          onChange={(v) => handleChange("deadline", v || "")}
        />
      </div>

      {/* ================= Description ================= */}
      <InputField
        label="Project Description"
        placeholder="Enter Project Description"
        value={form.description}
        onChange={(v) => handleChange("description", v)}
        multiline
        rows={4}
      />

      {/* ================= Footer ================= */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-brand-500 text-white py-2 rounded-md disabled:opacity-50"
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
