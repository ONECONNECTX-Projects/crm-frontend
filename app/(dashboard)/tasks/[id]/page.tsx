"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import ReplyModal from "../model/page";
import {
  getTaskById,
  updateTask,
  TaskDetail,
  TaskPayload,
} from "@/app/services/task/task.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveTaskType } from "@/app/services/task-type/task-type.service";
import { getAllActiveTaskStatus } from "@/app/services/task-status/task-status.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";

/* ---------------- Types ---------------- */
interface Reply {
  id: number;
  message: string;
  createdAt: string;
  attachments?: string[];
}

/* ---------------- Page ---------------- */
export default function TaskViewPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  /* Task State */
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    assignee_id: 0,
    task_priority_id: 0,
    task_status_id: 0,
    task_type_id: 0,
    company_id: 0,
    contact_id: 0,
    opportunity_id: 0,
    quote_id: 0,
    due_date: new Date(),
    description: "",
  });

  /* Dropdown Options */
  const [users, setUsers] = useState<OptionDropDownModel[]>([]);
  const [taskTypes, setTaskTypes] = useState<OptionDropDownModel[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<OptionDropDownModel[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);

  /* Replies */
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([
    { id: 1, message: "Initial investigation done.", createdAt: "1 hour ago" },
    {
      id: 2,
      message: "Waiting for client confirmation.",
      createdAt: "30 minutes ago",
    },
  ]);

  // Fetch task details and dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch task details and dropdown options in parallel
        const [taskRes, usersRes, typesRes, statusesRes, prioritiesRes] =
          await Promise.all([
            getTaskById(Number(taskId)),
            getAllActiveUsers(),
            getAllActiveTaskType(),
            getAllActiveTaskStatus(),
            getAllActivePriority(),
          ]);

        if (taskRes.data) {
          setTask(taskRes.data);
          setFormData({
            name: taskRes.data.name || "",
            assignee_id: taskRes.data.assignee_id || 0,
            task_priority_id: taskRes.data.task_priority_id || 0,
            task_status_id: taskRes.data.task_status_id || 0,
            task_type_id: taskRes.data.task_type_id || 0,
            company_id: taskRes.data.company_id || 0,
            contact_id: taskRes.data.contact_id || 0,
            opportunity_id: taskRes.data.opportunity_id || 0,
            quote_id: taskRes.data.quote_id || 0,
            due_date: taskRes.data.due_date
              ? new Date(taskRes.data.due_date)
              : new Date(),
            description: taskRes.data.description || "",
          });
        }

        setUsers(usersRes.data || []);
        setTaskTypes(typesRes.data || []);
        setTaskStatuses(statusesRes.data || []);
        setPriorities(prioritiesRes.data || []);
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const handleFormChange = (
    field: keyof typeof formData,
    value: string | number | Date,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddReply = (reply: Reply) => {
    setReplies((prev) => [...prev, reply]);
  };

  const handleSaveTask = async () => {
    try {
      setIsSaving(true);

      const payload: TaskPayload = {
        name: formData.name,
        assignee_id: formData.assignee_id,
        company_id: formData.company_id,
        contact_id: formData.contact_id,
        opportunity_id: formData.opportunity_id,
        Task_id: formData.quote_id,
        task_type_id: formData.task_type_id,
        task_priority_id: formData.task_priority_id,
        task_status_id: formData.task_status_id,
        due_date: formData.due_date,
        description: formData.description,
      };

      const response = await updateTask(Number(taskId), payload);

      if (response.isSuccess) {
        alert("Task updated successfully");
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Task not found</p>
          <button
            onClick={() => router.push("/tasks")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* ================= Left Panel (Editable) ================= */}
        <div className="col-span-4 bg-white rounded-xl border p-6 space-y-4">
          <div className="col-span-4 bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-semibold">Task Details</h2>
              <button
                onClick={handleSaveTask}
                disabled={isSaving}
                className={`px-4 py-1.5 rounded-md text-sm text-white
        ${
          isSaving
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
      `}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
            <ReadOnly label="Task ID" value={task.id.toString()} />

            <EditableInput
              label="Name"
              value={formData.name}
              onChange={(v) => handleFormChange("name", v)}
            />

            <EditableSelect
              label="Priority"
              value={formData.task_priority_id}
              options={priorities}
              onChange={(v) => handleFormChange("task_priority_id", Number(v))}
            />

            <EditableSelect
              label="Status"
              value={formData.task_status_id}
              options={taskStatuses}
              onChange={(v) => handleFormChange("task_status_id", Number(v))}
            />

            <EditableSelect
              label="Type"
              value={formData.task_type_id}
              options={taskTypes}
              onChange={(v) => handleFormChange("task_type_id", Number(v))}
            />

            <EditableSelect
              label="Assignee"
              value={formData.assignee_id}
              options={users}
              onChange={(v) => handleFormChange("assignee_id", Number(v))}
            />

            <ReadOnly
              label="Created Date"
              value={
                task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* ================= Right Panel (Replies) ================= */}
        <div className="col-span-8 bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold">Replies</h2>
            <button
              onClick={() => setShowReplyModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Reply
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm">{reply.message}</p>
                <p className="text-xs text-gray-500 mt-2">{reply.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReplyModal && (
        <ReplyModal
          taskId={taskId}
          onClose={() => setShowReplyModal(false)}
          onSubmit={handleAddReply}
        />
      )}
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function EditableInput({
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
      <label className="text-sm font-medium flex items-center gap-2">
        {label}
        <Pencil size={14} className="text-gray-400" />
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2"
      />
    </div>
  );
}

function EditableSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: OptionDropDownModel[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2">
        {label}
        <Pencil size={14} className="text-gray-400" />
      </label>
      <select
        value={value || ""}
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

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
