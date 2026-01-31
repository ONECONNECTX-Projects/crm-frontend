"use client";

import { useState, useEffect } from "react";
import { X, Plus, Calendar } from "lucide-react";
import {
  createTask,
  updateTask,
  getTaskById,
  TaskPayload,
} from "@/app/services/task/task.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveCompany } from "@/app/services/company/company.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveOpportunity } from "@/app/services/opportunity/opportunity.service";
import { getAllActiveQuotes } from "@/app/services/quote/quote.service";
import { getAllActiveTaskType } from "@/app/services/task-type/task-type.service";
import { getAllActiveTaskStatus } from "@/app/services/task-status/task-status.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";

interface CreateTaskProps {
  onClose: () => void;
  taskId?: number | null;
  defaultContactId?: number;
  defaultCompanyId?: number;
  defaultOpportunityId?: number;
}

export default function CreateTask({ onClose, taskId, defaultContactId, defaultCompanyId, defaultOpportunityId }: CreateTaskProps) {
  const isEditMode = !!taskId;
  const [loading, setLoading] = useState(false);
  const [fetchingTask, setFetchingTask] = useState(false);
  const [formData, setFormData] = useState<TaskPayload>({
    name: "",
    assignee_id: 0,
    company_id: defaultCompanyId || 0,
    contact_id: defaultContactId || 0,
    opportunity_id: defaultOpportunityId || 0,
    Task_id: 0,
    task_type_id: 0,
    task_priority_id: 0,
    task_status_id: 0,
    due_date: new Date(),
    description: "",
  });

  // Dropdown options
  const [users, setUsers] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [opportunities, setOpportunities] = useState<OptionDropDownModel[]>([]);
  const [quotes, setQuotes] = useState<OptionDropDownModel[]>([]);
  const [taskTypes, setTaskTypes] = useState<OptionDropDownModel[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<OptionDropDownModel[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);

  // Fetch all dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          usersRes,
          companiesRes,
          contactsRes,
          opportunitiesRes,
          quotesRes,
          taskTypesRes,
          taskStatusesRes,
          prioritiesRes,
        ] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompany(),
          getAllActiveContacts(),
          getAllActiveOpportunity(),
          getAllActiveQuotes(),
          getAllActiveTaskType(),
          getAllActiveTaskStatus(),
          getAllActivePriority(),
        ]);

        setUsers(usersRes.data || []);
        setCompanies(companiesRes.data || []);
        setContacts(contactsRes.data || []);
        setOpportunities(opportunitiesRes.data || []);
        setQuotes(quotesRes.data || []);
        setTaskTypes(taskTypesRes.data || []);
        setTaskStatuses(taskStatusesRes.data || []);
        setPriorities(prioritiesRes.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch task data when editing
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) return;

      try {
        setFetchingTask(true);
        const response = await getTaskById(taskId);
        if (response.data) {
          const task = response.data;
          setFormData({
            name: task.name || "",
            assignee_id: task.assignee_id || 0,
            company_id: task.company_id || 0,
            contact_id: task.contact_id || 0,
            opportunity_id: task.opportunity_id || 0,
            Task_id: task.quote_id || 0,
            task_type_id: task.task_type_id || 0,
            task_priority_id: task.task_priority_id || 0,
            task_status_id: task.task_status_id || 0,
            due_date: task.due_date ? new Date(task.due_date) : new Date(),
            description: task.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setFetchingTask(false);
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleInputChange = (
    field: keyof TaskPayload,
    value: string | number | Date
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Task name is required");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && taskId) {
        const response = await updateTask(taskId, formData);
        if (response.isSuccess) {
          onClose();
        } else {
          alert("Failed to update task");
        }
      } else {
        const response = await createTask(formData);
        if (response.isSuccess) {
          onClose();
        } else {
          alert("Failed to create task");
        }
      }
    } catch (error) {
      console.error("Error saving task:", error);
      alert(`Failed to ${isEditMode ? "update" : "create"} task`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTask) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={onClose}>
            <X size={18} />
          </button>
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Edit Task" : "Create Task"}
          </h2>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Task Name */}
        <Input
          label="* Task name"
          placeholder="Example name"
          value={formData.name}
          onChange={(value) => handleInputChange("name", value)}
        />

        {/* Assignee + Company */}
        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Assignee"
            options={users}
            value={formData.assignee_id}
            onChange={(value) =>
              handleInputChange("assignee_id", Number(value))
            }
          />
          <Select
            label="Company"
            plus
            options={companies}
            value={formData.company_id}
            onChange={(value) => handleInputChange("company_id", Number(value))}
          />
        </div>

        {/* Contact */}
        <Select
          label="Contact"
          plus
          options={contacts}
          value={formData.contact_id}
          onChange={(value) => handleInputChange("contact_id", Number(value))}
        />

        {/* Opportunity + Quote */}
        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Opportunity"
            plus
            options={opportunities}
            value={formData.opportunity_id}
            onChange={(value) =>
              handleInputChange("opportunity_id", Number(value))
            }
          />
          <Select
            label="Quote"
            plus
            options={quotes}
            value={formData.Task_id}
            onChange={(value) => handleInputChange("Task_id", Number(value))}
          />
        </div>

        {/* Task Type + Priority */}
        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Task Type"
            plus
            options={taskTypes}
            value={formData.task_type_id}
            onChange={(value) =>
              handleInputChange("task_type_id", Number(value))
            }
          />
          <Select
            label="Task Priority"
            plus
            options={priorities}
            value={formData.task_priority_id}
            onChange={(value) =>
              handleInputChange("task_priority_id", Number(value))
            }
          />
        </div>

        {/* Task Status */}
        <Select
          label="Task Status"
          plus
          options={taskStatuses}
          value={formData.task_status_id}
          onChange={(value) =>
            handleInputChange("task_status_id", Number(value))
          }
        />

        {/* Due Date */}
        <DateInput
          label="Due date"
          value={
            formData.due_date instanceof Date
              ? formData.due_date.toISOString().split("T")[0]
              : ""
          }
          onChange={(value) => handleInputChange("due_date", new Date(value))}
        />

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={4}
            placeholder="Descriptions"
            className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-16 py-2.5 rounded-md text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-brand-500 hover:bg-brand-600"
            }`}
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update"
                : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Fields ---------- */

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">
        <span className="text-red-500">*</span> {label.replace("* ", "")}
      </label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
      />
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
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm pr-10"
        />
        <Calendar
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}

function Select({
  label,
  options,
  plus,
  value,
  onChange,
}: {
  label: string;
  options: OptionDropDownModel[];
  plus?: boolean;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium">
        {label}
        {plus && (
          <span className="bg-brand-500 text-white rounded p-[2px]">
            <Plus size={12} />
          </span>
        )}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
