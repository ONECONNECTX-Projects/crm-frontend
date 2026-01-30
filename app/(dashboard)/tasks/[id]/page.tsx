"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2, X, FileIcon, Download } from "lucide-react";
import ReplyModal from "../model/page";
import {
  getTaskById,
  updateTask,
  deleteTaskComment,
  TaskDetail,
  TaskPayload,
  Comment,
} from "@/app/services/task/task.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveTaskType } from "@/app/services/task-type/task-type.service";
import { getAllActiveTaskStatus } from "@/app/services/task-status/task-status.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";
import { getFileUrl } from "@/app/services/File/file.service";

/* ---------------- Page ---------------- */
export default function TaskViewPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const { showSuccess, showError } = useError();

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
  const [replies, setReplies] = useState<Comment[]>([]);

  /* Image Preview Modal */
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>("");

  // Fetch task data
  const fetchTaskData = async () => {
    try {
      const taskRes = await getTaskById(Number(taskId));
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
        if (taskRes.data.comments) {
          setReplies(taskRes.data.comments);
        }
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

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
          if (taskRes.data.comments) {
            setReplies(taskRes.data.comments);
          }
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

  const handleCommentAdded = () => {
    // Refresh task data to get updated comments
    fetchTaskData();
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteTaskComment(commentId);
      showSuccess("Comment deleted successfully");
      // Refresh comments
      fetchTaskData();
    } catch (error) {
      console.error("Failed to delete comment:", error);
      showError("Failed to delete comment");
    }
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
        showSuccess("Task updated successfully");
      } else {
        showError("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showError("Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const isImageFile = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    return (
      type.includes("image") ||
      type.includes("png") ||
      type.includes("jpg") ||
      type.includes("jpeg") ||
      type.includes("gif") ||
      type.includes("webp")
    );
  };

  const handleAttachmentClick = (
    fileUrl: string,
    fileName: string,
    fileType: string,
  ) => {
    if (isImageFile(fileType)) {
      setPreviewImage(fileUrl);
      setPreviewFileName(fileName);
    } else {
      // For non-image files, download directly
      window.open(fileUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
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
            className="bg-brand-500 text-white px-4 py-2 rounded-md"
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
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-semibold">Task Details</h2>
            <button
              onClick={handleSaveTask}
              disabled={isSaving}
              className={`px-4 py-1.5 rounded-md text-sm text-white ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand-500 hover:bg-brand-600"
              }`}
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

        {/* ================= Right Panel (Comments) ================= */}
        <div className="col-span-8 bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold">
              Comments ({replies.length})
            </h2>
            <button
              onClick={() => setShowReplyModal(true)}
              className="bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 transition-colors"
            >
              Add Comment
            </button>
          </div>

          <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-gray-50 p-4 rounded-lg border relative group"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteComment(reply.id)}
                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete comment"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex justify-between items-start mb-2 pr-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                        <span className="text-brand-600 font-semibold text-sm">
                          {reply.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {reply.user?.name || "Unknown User"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap ml-10">
                    {reply.comment}
                  </p>

                  {/* Attachments Section */}
                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 ml-10">
                      <p className="text-xs text-gray-500 mb-2">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {reply.attachments.map((file) => (
                          <button
                            key={file.id}
                            onClick={() =>
                              handleAttachmentClick(
                                getFileUrl(file.file_url),
                                file.file_name,
                                file.file_type,
                              )
                            }
                            className="flex items-center gap-2 text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-brand-50 hover:border-brand-300 transition-all"
                          >
                            {isImageFile(file.file_type) ? (
                              <img
                                src={getFileUrl(file.file_url)}
                                alt={file.file_name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <FileIcon className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="truncate max-w-[120px] text-gray-700">
                              {file.file_name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No comments yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Be the first to add a comment!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <ReplyModal
          taskId={taskId}
          onClose={() => setShowReplyModal(false)}
          onSubmit={handleCommentAdded}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <img
              src={previewImage}
              alt={previewFileName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />

            {/* File Name & Download */}
            <div className="absolute -bottom-14 left-0 right-0 flex items-center justify-between text-white">
              <span className="text-sm truncate max-w-[300px]">
                {previewFileName}
              </span>
              <a
                href={previewImage}
                download={previewFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          </div>
        </div>
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
      <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
        {label}
        <Pencil size={14} className="text-gray-400" />
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
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
      <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
        {label}
        <Pencil size={14} className="text-gray-400" />
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
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
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
