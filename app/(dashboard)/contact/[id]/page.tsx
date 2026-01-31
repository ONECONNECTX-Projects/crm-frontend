"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  Contact,
  deleteContact,
  getContactById,
  getOpportunityByContactId,
  getTaskByContactId,
  getNotesByContactId,
  getQuoteByContactId,
  getAttachmentByContactId,
  getTicketByContactId,
} from "@/app/services/contact/contact.service";
import { Opportunity } from "@/app/services/opportunity/opportunity.service";
import { Task } from "@/app/services/task/task.service";
import { Notes } from "@/app/services/notes/notes.service";
import { Quote } from "@/app/services/quote/quote.service";
import { Attachment } from "@/app/services/attachment/attachement.service";
import { Ticket } from "@/app/services/tickets/tickets.service";
import DataTable, { TableColumn } from "@/app/common/DataTable";
import { useError } from "@/app/providers/ErrorProvider";
import SlideOver from "@/app/common/slideOver";
import CreateContactForm from "../create/page";

// Import Create Forms
import CreateOpportunity from "../../opportunity/create/page";
import CreateTask from "../../tasks/create/page";
import CreateNote from "../../other/note/create/page";
import CreateQuote from "../../sales/qoutes/Create/page";
import CreateAttachmentForm from "../../other/attachment/create/page";
import TicketForm from "../../tickets/create/page";

const tabs = [
  "Contact Information",
  "Opportunities",
  "Tasks",
  "Notes",
  "Attachments",
  "Quotes",
  "Tickets",
];

export default function ContactViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useError();
  const contactId = Number(params.id);
  const [activeTab, setActiveTab] = useState("Contact Information");
  const [contact, setContact] = useState<Contact | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Tab data states
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Loading states
  const [tabLoading, setTabLoading] = useState(false);

  // Track loaded tabs to avoid re-fetching
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  // Create modal states
  const [openCreateOpportunity, setOpenCreateOpportunity] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openCreateNote, setOpenCreateNote] = useState(false);
  const [openCreateQuote, setOpenCreateQuote] = useState(false);
  const [openCreateAttachment, setOpenCreateAttachment] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  useEffect(() => {
    if (!contactId) return;

    const fetchContact = async () => {
      try {
        const res = await getContactById(contactId);
        setContact(res.data || null);
      } catch (error) {
        console.error("Failed to fetch contact:", error);
        showError("Failed to fetch contact details");
      }
    };

    fetchContact();
  }, [contactId, showError]);

  // Fetch tab data based on active tab
  const fetchTabData = useCallback(
    async (tab: string, forceRefresh = false) => {
      if (!contactId || (loadedTabs.has(tab) && !forceRefresh)) return;

      setTabLoading(true);
      try {
        switch (tab) {
          case "Opportunities":
            const oppRes = await getOpportunityByContactId(contactId);
            setOpportunities(oppRes.data || []);
            break;
          case "Tasks":
            const taskRes = await getTaskByContactId(contactId);
            setTasks(taskRes.data || []);
            break;
          case "Notes":
            const notesRes = await getNotesByContactId(contactId);
            setNotes(notesRes.data || []);
            break;
          case "Quotes":
            const quotesRes = await getQuoteByContactId(contactId);
            setQuotes(quotesRes.data || []);
            break;
          case "Attachments":
            const attachRes = await getAttachmentByContactId(contactId);
            setAttachments(attachRes.data || []);
            break;
          case "Tickets":
            const ticketRes = await getTicketByContactId(contactId);
            setTickets(ticketRes.data || []);
            break;
        }
        setLoadedTabs((prev) => new Set(prev).add(tab));
      } catch (error) {
        console.error(`Failed to fetch ${tab}:`, error);
      } finally {
        setTabLoading(false);
      }
    },
    [contactId, loadedTabs],
  );

  // Fetch data when tab changes
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const handleDelete = async () => {
    if (!contact) return;
    const fullName = `${contact.first_name} ${contact.last_name}`;
    if (window.confirm(`Are you sure you want to delete "${fullName}"?`)) {
      try {
        await deleteContact(contact.id);
        showSuccess("Contact deleted successfully");
        router.push("/contact");
      } catch (error) {
        console.error("Failed to delete contact:", error);
        showError("Failed to delete contact");
      }
    }
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    router.push("/contact");
  };

  // Handle create success - refresh the tab data
  const handleCreateSuccess = (tab: string) => {
    fetchTabData(tab, true);
  };

  // Get create button config based on active tab
  const getCreateButtonConfig = () => {
    switch (activeTab) {
      case "Opportunities":
        return {
          label: "Create Opportunity",
          onClick: () => setOpenCreateOpportunity(true),
        };
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
      case "Tickets":
        return {
          label: "Create Ticket",
          onClick: () => setOpenCreateTicket(true),
        };
      default:
        return null;
    }
  };

  // Column definitions for each tab
  const opportunityColumns: TableColumn<Opportunity>[] = [
    { key: "name", label: "Name", visible: true },
    { key: "amount", label: "Amount", visible: true },
    {
      key: "owner",
      label: "Owner",
      visible: true,
      render: (row) => row.owner?.name || "-",
    },
    {
      key: "company",
      label: "Company",
      visible: true,
      render: (row) => row.company?.name || "-",
    },
    {
      key: "stage",
      label: "Stage",
      visible: true,
      render: (row) => row.stage?.name || "-",
    },
    {
      key: "created_at",
      label: "Created",
      visible: true,
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
    },
  ];

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

  const ticketColumns: TableColumn<Ticket>[] = [
    { key: "subject", label: "Subject", visible: true },
    { key: "email", label: "Email", visible: true },
    {
      key: "category",
      label: "Category",
      visible: true,
      render: (row) => row.category?.name || "-",
    },
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
      case "Opportunities":
        return (
          <DataTable
            columns={opportunityColumns}
            data={opportunities}
            emptyMessage="No opportunities found"
          />
        );
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
      case "Tickets":
        return (
          <DataTable
            columns={ticketColumns}
            data={tickets}
            emptyMessage="No tickets found"
          />
        );
      default:
        return null;
    }
  };

  const createButtonConfig = getCreateButtonConfig();

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading contact...</p>
      </div>
    );
  }

  const fullName = `${contact.first_name} ${contact.last_name}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/contact")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <span>&larr;</span>
          <span>Back to Contacts</span>
        </button>
        <button
          onClick={() => setOpenEdit(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          Edit Contact
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
              {contact.first_name?.[0]?.toUpperCase() || "?"}
            </div>
            <h2 className="mt-3 font-semibold">{fullName}</h2>
            <p className="text-sm text-gray-500">{contact.job_title || "-"}</p>
            <p className="text-sm text-brand-500">
              {contact.company?.name || "-"}
            </p>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-gray-400">Contact Owner</p>
              <p>{contact.owner?.name || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p>{contact.email || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p>{contact.phone || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Job Title</p>
              <p>{contact.job_title || "-"}</p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="mt-6 w-full border border-red-500 text-red-500 rounded-md py-1.5 text-sm hover:bg-red-50"
          >
            Delete Contact
          </button>
        </div>

        {/* Right Details */}
        <div className="flex-1 space-y-6">
          {activeTab === "Contact Information" ? (
            <>
              {/* Basic Info */}
              <Section title="Basic Information">
                <Field label="First Name" value={contact.first_name || "-"} />
                <Field label="Last Name" value={contact.last_name || "-"} />
                <Field label="Email" value={contact.email || "-"} />
                <Field label="Phone" value={contact.phone || "-"} />
                <Field label="Birthday" value={contact.birthday || "-"} />
                <Field label="Job Title" value={contact.job_title || "-"} />
                <Field label="Company" value={contact.company?.name || "-"} />
                <Field
                  label="Department"
                  value={contact.department?.name || "-"}
                />
                <Field label="Industry" value={contact.industry?.name || "-"} />
                <Field label="Stage" value={contact.stage?.name || "-"} />
                <Field label="Source" value={contact.source?.name || "-"} />
              </Section>

              {/* Present Address */}
              <Section title="Present Address">
                <Field
                  label="Address"
                  value={contact.address?.present_address || "-"}
                />
                <Field
                  label="City"
                  value={contact.address?.present_city || "-"}
                />
                <Field
                  label="State"
                  value={contact.address?.present_state || "-"}
                />
                <Field
                  label="ZIP Code"
                  value={contact.address?.present_zip || "-"}
                />
                <Field
                  label="Country"
                  value={contact.address?.present_country || "-"}
                />
              </Section>

              {/* Permanent Address */}
              <Section title="Permanent Address">
                <Field
                  label="Address"
                  value={contact.address?.permanent_address || "-"}
                />
                <Field
                  label="City"
                  value={contact.address?.permanent_city || "-"}
                />
                <Field
                  label="State"
                  value={contact.address?.permanent_state || "-"}
                />
                <Field
                  label="ZIP Code"
                  value={contact.address?.permanent_zip || "-"}
                />
                <Field
                  label="Country"
                  value={contact.address?.permanent_country || "-"}
                />
              </Section>

              {/* Social */}
              <Section title="Social Links">
                <Field label="LinkedIn" value={contact.linkedin || "-"} />
                <Field label="Twitter" value={contact.twitter || "-"} />
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

      {/* Edit Contact SlideOver */}
      <SlideOver
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        width="sm:w-[70vw] lg:w-[60vw]"
      >
        <CreateContactForm
          mode="edit"
          data={contact}
          onClose={() => setOpenEdit(false)}
          onSuccess={handleEditSuccess}
        />
      </SlideOver>

      {/* Create Opportunity SlideOver */}
      <SlideOver
        open={openCreateOpportunity}
        onClose={() => setOpenCreateOpportunity(false)}
        width="max-w-5xl"
      >
        <CreateOpportunity
          mode="create"
          onClose={() => setOpenCreateOpportunity(false)}
          onSuccess={() => {
            setOpenCreateOpportunity(false);
            handleCreateSuccess("Opportunities");
          }}
          defaultContactId={contactId}
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
          defaultContactId={contactId}
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
          defaultContactId={contactId}
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
          defaultContactId={contactId}
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
          defaultContactId={contactId}
        />
      </SlideOver>

      {/* Create Ticket SlideOver */}
      <SlideOver
        open={openCreateTicket}
        onClose={() => setOpenCreateTicket(false)}
        width="max-w-3xl"
      >
        <TicketForm
          onCancel={() => setOpenCreateTicket(false)}
          onSuccess={() => {
            setOpenCreateTicket(false);
            handleCreateSuccess("Tickets");
          }}
          defaultContactId={contactId}
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
