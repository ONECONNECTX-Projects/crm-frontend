"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useError } from "@/app/providers/ErrorProvider";
import { useParams, useRouter } from "next/navigation";
import {
  Opportunity,
  getOpportunityById,
  deleteOpportunity,
  getTaskByOpportunityId,
  getNoteByOpportunityId,
  getQuoteByOpportunityId,
  getAttachmentByOpportunityId,
} from "@/app/services/opportunity/opportunity.service";
import { Task } from "@/app/services/task/task.service";
import { Notes } from "@/app/services/notes/notes.service";
import { Quote } from "@/app/services/quote/quote.service";
import { Attachment } from "@/app/services/attachment/attachement.service";
import DataTable, { TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";

// Import Create/Edit Forms
import CreateOpportunityForm from "../create/page";
import CreateTask from "../../tasks/create/page";
import CreateNote from "../../other/note/create/page";
import CreateQuote from "../../sales/qoutes/Create/page";
import CreateAttachmentForm from "../../other/attachment/create/page";

const tabs = [
  "Opportunity Information",
  "Tasks",
  "Notes",
  "Attachments",
  "Quotes",
];

export default function OpportunityViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useError();
  const opportunityId = Number(params.id);

  const [activeTab, setActiveTab] = useState("Opportunity Information");
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Tab data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Loading and loaded tabs states
  const [tabLoading, setTabLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  // Create modal states
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openCreateNote, setOpenCreateNote] = useState(false);
  const [openCreateQuote, setOpenCreateQuote] = useState(false);
  const [openCreateAttachment, setOpenCreateAttachment] = useState(false);

  useEffect(() => {
    if (!opportunityId) return;

    const fetchOpportunity = async () => {
      try {
        const res = await getOpportunityById(opportunityId);
        setOpportunity(res.data || null);
      } catch (error) {
        console.error("Failed to fetch opportunity:", error);
        showError("Failed to fetch opportunity details");
      }
    };

    fetchOpportunity();
  }, [opportunityId, showError]);

  // Fetch tab data based on active tab
  const fetchTabData = useCallback(
    async (tab: string, forceRefresh = false) => {
      if (!opportunityId || (loadedTabs.has(tab) && !forceRefresh)) return;

      setTabLoading(true);
      try {
        switch (tab) {
          case "Tasks":
            const taskRes = await getTaskByOpportunityId(opportunityId);
            setTasks(taskRes.data || []);
            break;
          case "Notes":
            const notesRes = await getNoteByOpportunityId(opportunityId);
            setNotes(notesRes.data || []);
            break;
          case "Quotes":
            const quotesRes = await getQuoteByOpportunityId(opportunityId);
            setQuotes(quotesRes.data || []);
            break;
          case "Attachments":
            const attachRes = await getAttachmentByOpportunityId(opportunityId);
            setAttachments(attachRes.data || []);
            break;
        }
        setLoadedTabs((prev) => new Set(prev).add(tab));
      } catch (error) {
        console.error(`Failed to fetch ${tab}:`, error);
      } finally {
        setTabLoading(false);
      }
    },
    [opportunityId, loadedTabs]
  );

  // Fetch data when tab changes
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const handleDelete = async () => {
    if (!opportunity) return;
    if (
      window.confirm(`Are you sure you want to delete "${opportunity.name}"?`)
    ) {
      try {
        await deleteOpportunity(opportunityId);
        showSuccess("Opportunity deleted successfully");
        router.push("/opportunity");
      } catch (error) {
        console.error("Failed to delete opportunity:", error);
        showError("Failed to delete opportunity");
      }
    }
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    router.push("/opportunity");
  };

  // Handle create success - refresh the tab data
  const handleCreateSuccess = (tab: string) => {
    fetchTabData(tab, true);
  };

  // Get create button config based on active tab
  const getCreateButtonConfig = () => {
    switch (activeTab) {
      case "Tasks":
        return { label: "Create Task", onClick: () => setOpenCreateTask(true) };
      case "Notes":
        return { label: "Create Note", onClick: () => setOpenCreateNote(true) };
      case "Quotes":
        return {
          label: "Create Quote",
          onClick: () => setOpenCreateQuote(true),
        };
      case "Attachments":
        return {
          label: "Upload Attachment",
          onClick: () => setOpenCreateAttachment(true),
        };
      default:
        return null;
    }
  };

  // Column definitions for each tab
  const taskColumns: TableColumn<Task>[] = [
    { key: "name", label: "Name", visible: true },
    {
      key: "priority",
      label: "Priority",
      visible: true,
      render: (row) => row.priority?.name || "-",
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => row.status?.name || "-",
    },
    {
      key: "type",
      label: "Type",
      visible: true,
      render: (row) => row.type?.name || "-",
    },
    {
      key: "due_date",
      label: "Due Date",
      visible: true,
      render: (row) =>
        row.due_date ? new Date(row.due_date).toLocaleDateString() : "-",
    },
  ];

  const notesColumns: TableColumn<Notes>[] = [
    { key: "title", label: "Title", visible: true },
    {
      key: "owner",
      label: "Owner",
      visible: true,
      render: (row) => row.owner?.name || "-",
    },
    {
      key: "description",
      label: "Description",
      visible: true,
      render: (row) =>
        row.description?.substring(0, 50) +
          (row.description?.length > 50 ? "..." : "") || "-",
    },
    {
      key: "createdAt",
      label: "Created",
      visible: true,
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },
  ];

  const quotesColumns: TableColumn<Quote>[] = [
    { key: "name", label: "Name", visible: true },
    {
      key: "total_amount",
      label: "Amount",
      visible: true,
      render: (row) => (row.total_amount ? `$${row.total_amount}` : "-"),
    },
    {
      key: "owner",
      label: "Owner",
      visible: true,
      render: (row) => row.owner?.name || "-",
    },
    {
      key: "stage",
      label: "Stage",
      visible: true,
      render: (row) => row.stage?.name || "-",
    },
    {
      key: "quote_date",
      label: "Quote Date",
      visible: true,
      render: (row) =>
        row.quote_date ? new Date(row.quote_date).toLocaleDateString() : "-",
    },
  ];

  const attachmentColumns: TableColumn<Attachment>[] = [
    { key: "file_name", label: "File Name", visible: true },
    { key: "file_type", label: "Type", visible: true },
    {
      key: "owner",
      label: "Owner",
      visible: true,
      render: (row) => row.owner?.name || "-",
    },
    {
      key: "createdAt",
      label: "Uploaded",
      visible: true,
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },
  ];

  // Render tab content
  const renderTabContent = () => {
    if (tabLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "Tasks":
        return (
          <DataTable
            columns={taskColumns}
            data={tasks}
            emptyMessage="No tasks found"
          />
        );
      case "Notes":
        return (
          <DataTable
            columns={notesColumns}
            data={notes}
            emptyMessage="No notes found"
          />
        );
      case "Quotes":
        return (
          <DataTable
            columns={quotesColumns}
            data={quotes}
            emptyMessage="No quotes found"
          />
        );
      case "Attachments":
        return (
          <DataTable
            columns={attachmentColumns}
            data={attachments}
            emptyMessage="No attachments found"
          />
        );
      default:
        return null;
    }
  };

  const createButtonConfig = getCreateButtonConfig();

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading opportunity...</p>
      </div>
    );
  }

  const contactName = opportunity.contact
    ? `${opportunity.contact.first_name} ${opportunity.contact.last_name}`
    : "-";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/opportunity")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <span>&larr;</span>
          <span>Back to Opportunities</span>
        </button>
        <button
          onClick={() => setOpenEdit(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          Edit Opportunity
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-brand-500 text-brand-500 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Left Profile */}
        <div className="w-1/4 bg-white rounded-xl p-5 shadow-sm h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-semibold">
              {opportunity.name?.[0]?.toUpperCase() || "?"}
            </div>
            <h2 className="mt-3 font-semibold">{opportunity.name}</h2>
            <p className="text-sm text-green-600 font-bold">
              ${opportunity.amount || "0"}
            </p>
            <p className="text-sm text-brand-500">
              {opportunity.stage?.name || "-"}
            </p>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-gray-400">Opportunity Owner</p>
              <p>{opportunity.owner?.name || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Company</p>
              <p>{opportunity.company?.name || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Contact</p>
              <p>{contactName}</p>
            </div>
            <div>
              <p className="text-gray-400">Type</p>
              <p>{opportunity.type?.name || "-"}</p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="mt-6 w-full border border-red-500 text-red-500 rounded-md py-1.5 text-sm hover:bg-red-50"
          >
            Delete Opportunity
          </button>
        </div>

        {/* Right Details */}
        <div className="flex-1 space-y-6">
          {activeTab === "Opportunity Information" ? (
            <>
              {/* Basic Info */}
              <Section title="Basic Information">
                <Field label="Opportunity Name" value={opportunity.name || "-"} />
                <Field label="Amount" value={`$${opportunity.amount || "0"}`} />
                <Field label="Owner" value={opportunity.owner?.name || "-"} />
                <Field label="Company" value={opportunity.company?.name || "-"} />
                <Field label="Contact" value={contactName} />
                <Field label="Stage" value={opportunity.stage?.name || "-"} />
                <Field label="Type" value={opportunity.type?.name || "-"} />
                <Field label="Source" value={opportunity.source?.name || "-"} />
              </Section>

              {/* Dates */}
              <Section title="Dates">
                <Field
                  label="Start Date"
                  value={
                    opportunity.start_date
                      ? new Date(opportunity.start_date).toLocaleDateString()
                      : "-"
                  }
                />
                <Field
                  label="Close Date"
                  value={
                    opportunity.close_date
                      ? new Date(opportunity.close_date).toLocaleDateString()
                      : "-"
                  }
                />
              </Section>

              {/* Additional Details */}
              <Section title="Additional Details">
                <Field label="Next Step" value={opportunity.next_step || "-"} />
                <Field label="Competitors" value={opportunity.competitors || "-"} />
              </Section>

              {/* Description */}
              <Section title="Description">
                <div className="col-span-2">
                  <p className="text-gray-800">
                    {opportunity.description || "-"}
                  </p>
                </div>
              </Section>
            </>
          ) : (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{activeTab}</h3>
                {createButtonConfig && (
                  <button
                    onClick={createButtonConfig.onClick}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 text-sm"
                  >
                    <Plus size={16} />
                    {createButtonConfig.label}
                  </button>
                )}
              </div>
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>

      {/* Edit Opportunity SlideOver */}
      <SlideOver
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        width="max-w-5xl"
      >
        <CreateOpportunityForm
          mode="edit"
          data={opportunity}
          onClose={() => setOpenEdit(false)}
          onSuccess={handleEditSuccess}
        />
      </SlideOver>

      {/* Create Task SlideOver */}
      <SlideOver
        open={openCreateTask}
        onClose={() => setOpenCreateTask(false)}
        width="max-w-5xl"
      >
        <CreateTask
          onClose={() => {
            setOpenCreateTask(false);
            handleCreateSuccess("Tasks");
          }}
          defaultOpportunityId={opportunityId}
        />
      </SlideOver>

      {/* Create Note SlideOver */}
      <SlideOver
        open={openCreateNote}
        onClose={() => setOpenCreateNote(false)}
        width="max-w-3xl"
      >
        <CreateNote
          mode="create"
          onClose={() => setOpenCreateNote(false)}
          onSuccess={() => {
            setOpenCreateNote(false);
            handleCreateSuccess("Notes");
          }}
          defaultOpportunityId={opportunityId}
        />
      </SlideOver>

      {/* Create Quote SlideOver */}
      <SlideOver
        open={openCreateQuote}
        onClose={() => setOpenCreateQuote(false)}
        width="max-w-5xl"
      >
        <CreateQuote
          onClose={() => setOpenCreateQuote(false)}
          onSuccess={() => {
            setOpenCreateQuote(false);
            handleCreateSuccess("Quotes");
          }}
          defaultOpportunityId={opportunityId}
        />
      </SlideOver>

      {/* Create Attachment SlideOver */}
      <SlideOver
        open={openCreateAttachment}
        onClose={() => setOpenCreateAttachment(false)}
        width="max-w-3xl"
      >
        <CreateAttachmentForm
          onClose={() => setOpenCreateAttachment(false)}
          onSuccess={() => {
            setOpenCreateAttachment(false);
            handleCreateSuccess("Attachments");
          }}
          defaultOpportunityId={opportunityId}
        />
      </SlideOver>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
