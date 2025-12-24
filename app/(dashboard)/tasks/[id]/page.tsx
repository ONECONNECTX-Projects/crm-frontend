"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import ReplyModal from "../model/page";

/* ---------------- Types ---------------- */
interface Reply {
  id: number;
  message: string;
  createdAt: string;
  attachments?: string[];
}

interface Task {
  id: number;
  name: string;
  priority: string;
  status: string;
  type: string;
  assignee: string;
  createdAt: string;
}

/* ---------------- Page ---------------- */
export default function TaskViewPage() {
  const params = useParams();
  const taskId = params.id;

  /* Task State */
  const [task, setTask] = useState<Task>({
    id: Number(taskId),
    name: "Follow up with client",
    priority: "High",
    status: "Pending",
    type: "Call",
    assignee: "John Doe",
    createdAt: "Dec 17, 2025",
  });

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

  const handleTaskChange = (key: keyof Task, value: string) => {
    setTask((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddReply = (reply: Reply) => {
    setReplies((prev) => [...prev, reply]);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTask = async () => {
    try {
      setIsSaving(true);

      // 🔗 API call later
      console.log("Saving task:", task);

      // await fetch(`/api/tasks/${task.id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(task),
      // });

      setTimeout(() => {
        setIsSaving(false);
        alert("Task updated successfully ✅");
      }, 800);
    } catch (error) {
      setIsSaving(false);
      alert("Failed to save task ❌");
    }
  };

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
              value={task.name}
              onChange={(v) => handleTaskChange("name", v)}
            />

            <EditableSelect
              label="Priority"
              value={task.priority}
              options={["Low", "Medium", "High"]}
              onChange={(v) => handleTaskChange("priority", v)}
            />

            <EditableSelect
              label="Status"
              value={task.status}
              options={["Pending", "In Progress", "Completed", "Scheduled"]}
              onChange={(v) => handleTaskChange("status", v)}
            />

            <EditableSelect
              label="Type"
              value={task.type}
              options={["Call", "Email", "Meeting", "Task", "Review"]}
              onChange={(v) => handleTaskChange("type", v)}
            />

            <EditableSelect
              label="Assignee"
              value={task.assignee}
              options={["John Doe", "Jane Smith", "Alex Brown", "Demo User"]}
              onChange={(v) => handleTaskChange("assignee", v)}
            />

            <ReadOnly label="Created Date" value={task.createdAt} />
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
          taskId={taskId as string}
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
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2">
        {label}
        <Pencil size={14} className="text-gray-400" />
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2 bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
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
