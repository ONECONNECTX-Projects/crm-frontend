"use client";

import { useState } from "react";
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

/* ---------------- Types ---------------- */

interface Task {
  id: number;
  name: string;
  priority: string;
  status: string;
  type: string;
  assignee: string;
  createdAt: string;
  dueDate?: string;
  relatedTo?: string;
}

const statusColorMap = {
  Pending: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  "In Progress": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
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

const priorityColorMap = {
  Low: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  Medium: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "pipeline">("list");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "assignee", label: "Assignee", visible: true },
    { key: "createdAt", label: "Create date", visible: true },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Follow up with client",
      priority: "High",
      status: "Pending",
      type: "Call",
      assignee: "John Doe",
      createdAt: "Dec 17, 2025",
    },
    {
      id: 2,
      name: "Send proposal",
      priority: "Medium",
      status: "In Progress",
      type: "Email",
      assignee: "Jane Smith",
      createdAt: "Dec 16, 2025",
    },
    {
      id: 3,
      name: "Product demo",
      priority: "High",
      status: "Scheduled",
      type: "Meeting",
      assignee: "Alex Brown",
      createdAt: "Dec 15, 2025",
    },
    {
      id: 4,
      name: "Prepare quotation",
      priority: "Low",
      status: "Completed",
      type: "Task",
      assignee: "Demo User",
      createdAt: "Dec 14, 2025",
    },
    {
      id: 5,
      name: "Update CRM notes",
      priority: "Low",
      status: "Pending",
      type: "Task",
      assignee: "John Doe",
      createdAt: "Dec 13, 2025",
    },
    {
      id: 6,
      name: "Contract review",
      priority: "High",
      status: "In Progress",
      type: "Review",
      assignee: "Jane Smith",
      createdAt: "Dec 12, 2025",
    },
    {
      id: 7,
      name: "Client onboarding",
      priority: "Medium",
      status: "Pending",
      type: "Meeting",
      assignee: "Alex Brown",
      createdAt: "Dec 11, 2025",
    },
    {
      id: 8,
      name: "Internal sync",
      priority: "Low",
      status: "Completed",
      type: "Meeting",
      assignee: "Demo User",
      createdAt: "Dec 10, 2025",
    },
    {
      id: 9,
      name: "Email follow-up",
      priority: "Medium",
      status: "Pending",
      type: "Email",
      assignee: "John Doe",
      createdAt: "Dec 09, 2025",
    },
    {
      id: 10,
      name: "Prepare presentation",
      priority: "High",
      status: "In Progress",
      type: "Task",
      assignee: "Jane Smith",
      createdAt: "Dec 08, 2025",
    },
  ]);

  const actions: TableAction<Task>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/tasks/${row.id}`),
    },
    {
      label: "Edit",
      onClick: () => setOpen(true),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("delete task", row),
    },
  ];

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    Object.values(task).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Enhance columns with status and priority rendering
  const enhancedColumns: TableColumn<Task>[] = columns.map((col) => ({
    key: col.key as keyof Task,
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
      return <span>{(row as any)[col.key]}</span>;
    },
  }));

  // Group tasks by status for pipeline view
  const tasksByStatus = {
    Pending: filteredTasks.filter((t) => t.status === "Pending"),
    "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
    Testing: filteredTasks.filter((t) => t.status === "Testing"),
    Scheduled: filteredTasks.filter((t) => t.status === "Scheduled"),
    Completed: filteredTasks.filter((t) => t.status === "Completed"),
  };

  // Drag and Drop Handlers
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow dropping
  };

  const handleDrop = (newStatus: string) => {
    if (draggedTask && draggedTask.status !== newStatus) {
      // Update task status
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status: newStatus } : task
        )
      );

      // Optional: Make API call to update task status
      // await fetch(`/api/tasks/${draggedTask.id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // });
    }
    setDraggedTask(null);
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

        {viewMode === "list" ? (
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
              emptyMessage="Empty"
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
              {/* Pending */}
              <div className="w-80 flex-shrink-0">
                <div
                  className="bg-gray-100 rounded-lg p-4 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("Pending")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Pending</h3>
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {tasksByStatus.Pending.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus.Pending.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {task.name}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Assigned:</span>
                            <span className="font-medium">{task.assignee}</span>
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
                    {tasksByStatus.Pending.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No tasks
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="w-80 flex-shrink-0">
                <div
                  className="bg-blue-100 rounded-lg p-4 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("In Progress")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">In Progress</h3>
                    <span className="bg-blue-200 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      {tasksByStatus["In Progress"].length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus["In Progress"].map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md transition-shadow cursor-move"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {task.name}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Assigned:</span>
                            <span className="font-medium">{task.assignee}</span>
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
                    {tasksByStatus["In Progress"].length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No tasks
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Testing */}
              <div className="w-80 flex-shrink-0">
                <div
                  className="bg-yellow-100 rounded-lg p-4 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("Testing")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Testing</h3>
                    <span className="bg-yellow-200 text-yellow-700 text-xs font-medium px-2 py-1 rounded">
                      {tasksByStatus.Testing.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus.Testing.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200 hover:shadow-md transition-shadow cursor-move"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {task.name}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Assigned:</span>
                            <span className="font-medium">{task.assignee}</span>
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
                    {tasksByStatus.Testing.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No tasks
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Scheduled */}
              <div className="w-80 flex-shrink-0">
                <div
                  className="bg-purple-100 rounded-lg p-4 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("Scheduled")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Scheduled</h3>
                    <span className="bg-purple-200 text-purple-700 text-xs font-medium px-2 py-1 rounded">
                      {tasksByStatus.Scheduled.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus.Scheduled.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-purple-200 hover:shadow-md transition-shadow cursor-move"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {task.name}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Assigned:</span>
                            <span className="font-medium">{task.assignee}</span>
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
                    {tasksByStatus.Scheduled.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No tasks
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="w-80 flex-shrink-0">
                <div
                  className="bg-green-100 rounded-lg p-4 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("Completed")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Completed</h3>
                    <span className="bg-green-200 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      {tasksByStatus.Completed.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus.Completed.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-green-200 hover:shadow-md transition-shadow cursor-move"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {task.name}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Assigned:</span>
                            <span className="font-medium">{task.assignee}</span>
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
                    {tasksByStatus.Completed.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No tasks
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <SlideOver open={open} onClose={() => setOpen(false)} width="max-w-5xl">
        <CreateTask onClose={() => setOpen(false)} />
      </SlideOver>
    </div>
  );
}
