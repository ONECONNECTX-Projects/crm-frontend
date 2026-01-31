"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import Pagination from "@/app/common/pagination";
import SlideOver from "@/app/common/slideOver";
import CreateTask from "./create/page";
import StatusBadge from "@/app/common/StatusBadge";
import {
  getAllTask,
  deleteTask,
  updateTaskStatusById,
  Task as ApiTask,
} from "@/app/services/task/task.service";
import { getAllActiveTaskStatus } from "@/app/services/task-status/task-status.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";

/* ---------------- Types ---------------- */

interface TaskListItem {
  id: number;
  name: string;
  priority: string;
  priorityId: number;
  status: string;
  statusId: number;
  type: string;
  assignee: string;
  createdAt: string;
  dueDate?: string;
}

const statusColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Pending: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  "In Progress": {
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
  },
  Scheduled: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  Testing: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  Completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
};

const priorityColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Low: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  Medium: {
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
  },
  High: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  Urgent: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export default function TasksPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "pipeline">("list");
  const [draggedTask, setDraggedTask] = useState<TaskListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskStatuses, setTaskStatuses] = useState<OptionDropDownModel[]>([]);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "assignee", label: "Assignee", visible: true },
    { key: "createdAt", label: "Create date", visible: true },
  ]);

  const [tasks, setTasks] = useState<TaskListItem[]>([]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTask();
      if (response.data) {
        const formattedTasks: TaskListItem[] = response.data.map(
          (task: ApiTask) => ({
            id: task.id,
            name: task.name,
            priority: task.priority?.name || "N/A",
            priorityId: task.task_priority_id,
            status: task.status?.name || "N/A",
            statusId: task.task_status_id,
            type: task.type?.name || "N/A",
            assignee: task.contact ? `${task.contact.name} ` : "N/A",
            createdAt: task.createdAt
              ? new Date(task.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A",
            dueDate: task.due_date
              ? new Date(task.due_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : undefined,
          }),
        );
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch task statuses for pipeline view
  const fetchTaskStatuses = async () => {
    try {
      const response = await getAllActiveTaskStatus();
      if (response.data) {
        setTaskStatuses(response.data);
      }
    } catch (error) {
      console.error("Error fetching task statuses:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTaskStatuses();
  }, []);

  // Handle task deletion
  const handleDeleteTask = async (task: TaskListItem) => {
    if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
      try {
        await deleteTask(task.id);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // Handle task creation/update success
  const handleTaskCreated = () => {
    setOpen(false);
    setEditTaskId(null);
    fetchTasks();
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpen(false);
    setEditTaskId(null);
  };

  const actions: TableAction<TaskListItem>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/tasks/${row.id}`),
    },
    {
      label: "Edit",
      onClick: (row) => {
        setEditTaskId(row.id);
        setOpen(true);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => handleDeleteTask(row),
    },
  ];

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const filteredTasks = tasks.filter((task) =>
    Object.values(task).join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Enhance columns with status and priority rendering
  const enhancedColumns: TableColumn<TaskListItem>[] = columns.map((col) => ({
    key: col.key as keyof TaskListItem,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      if (col.key === "status") {
        return (
          <StatusBadge
            status={row.status}
            colorMap={statusColorMap}
            variant="default"
          />
        );
      }
      if (col.key === "priority") {
        return (
          <StatusBadge
            status={row.priority}
            colorMap={priorityColorMap}
            variant="default"
          />
        );
      }
      return (
        <span>
          {String((row as unknown as Record<string, unknown>)[col.key] ?? "")}
        </span>
      );
    },
  }));

  // Group tasks by status for pipeline view
  const getTasksByStatus = (statusName: string) => {
    return filteredTasks.filter(
      (t) => t.status.toLowerCase() === statusName.toLowerCase(),
    );
  };

  // Drag and Drop Handlers
  const handleDragStart = (task: TaskListItem) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatusId: number, newStatusName: string) => {
    if (draggedTask && draggedTask.status !== newStatusName) {
      try {
        // Call API to update task status
        await updateTaskStatusById(draggedTask.id, newStatusId);

        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === draggedTask.id
              ? { ...task, status: newStatusName, statusId: newStatusId }
              : task,
          ),
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
    setDraggedTask(null);
  };

  // Get status color based on status name
  const getStatusColor = (statusName: string) => {
    const lowerStatus = statusName.toLowerCase();
    if (lowerStatus.includes("pending")) return "gray";
    if (lowerStatus.includes("progress")) return "blue";
    if (lowerStatus.includes("testing")) return "yellow";
    if (lowerStatus.includes("scheduled")) return "purple";
    if (lowerStatus.includes("completed") || lowerStatus.includes("done"))
      return "green";
    return "gray";
  };

  const getStatusBgClass = (color: string) => {
    const colorMap: Record<string, string> = {
      gray: "bg-gray-100",
      blue: "bg-brand-100",
      yellow: "bg-yellow-100",
      purple: "bg-purple-100",
      green: "bg-green-100",
    };
    return colorMap[color] || "bg-gray-100";
  };

  const getStatusBadgeClass = (color: string) => {
    const colorMap: Record<string, string> = {
      gray: "bg-gray-200 text-gray-700",
      blue: "bg-brand-200 text-brand-500",
      yellow: "bg-yellow-200 text-yellow-700",
      purple: "bg-purple-200 text-purple-700",
      green: "bg-green-200 text-green-700",
    };
    return colorMap[color] || "bg-gray-200 text-gray-700";
  };

  const getStatusBorderClass = (color: string) => {
    const colorMap: Record<string, string> = {
      gray: "border-gray-200",
      blue: "border-brand-200",
      yellow: "border-yellow-200",
      purple: "border-purple-200",
      green: "border-green-200",
    };
    return colorMap[color] || "border-gray-200";
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="max-w-9xl mx-auto space-y-6">
        <PageHeader
          title="Tasks"
          createButtonText="Create Task"
          onCreateClick={() => setOpen(true)}
        />

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            List View
          </Button>
          <Button
            variant={viewMode === "pipeline" ? "default" : "outline"}
            onClick={() => setViewMode("pipeline")}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Pipeline View
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        ) : viewMode === "list" ? (
          <>
            <PageActions
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search"
              columns={columns}
              onColumnToggle={handleColumnToggle}
              onFilterClick={() => {}}
              onPrintPDF={() => {}}
              onDownloadCSV={() => {}}
            />

            <DataTable
              columns={enhancedColumns}
              data={paginatedTasks}
              actions={actions}
              emptyMessage="No tasks found"
            />

            <Pagination
              currentPage={currentPage}
              totalItems={filteredTasks.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </>
        ) : (
          /* Pipeline/Kanban View */
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {taskStatuses.map((status) => {
                const statusColor = getStatusColor(status.name);
                const tasksInStatus = getTasksByStatus(status.name);

                return (
                  <div key={status.id} className="w-80 flex-shrink-0">
                    <div
                      className={`${getStatusBgClass(statusColor)} rounded-lg p-4 min-h-[200px]`}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(status.id, status.name)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          {status.name}
                        </h3>
                        <span
                          className={`${getStatusBadgeClass(statusColor)} text-xs font-medium px-2 py-1 rounded`}
                        >
                          {tasksInStatus.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {tasksInStatus.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task)}
                            className={`bg-white rounded-lg p-4 shadow-sm border ${getStatusBorderClass(statusColor)} hover:shadow-md transition-shadow cursor-move`}
                            onClick={() => router.push(`/tasks/${task.id}`)}
                          >
                            <h4 className="font-medium text-gray-900 mb-2">
                              {task.name}
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Assigned:</span>
                                <span className="font-medium">
                                  {task.assignee}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Priority:</span>
                                <StatusBadge
                                  status={task.priority}
                                  colorMap={priorityColorMap}
                                  variant="default"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">{task.type}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {tasksInStatus.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No tasks
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <SlideOver open={open} onClose={handleCloseModal} width="max-w-5xl">
        <CreateTask onClose={handleTaskCreated} taskId={editTaskId} />
      </SlideOver>
    </div>
  );
}
