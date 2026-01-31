"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useError } from "@/app/providers/ErrorProvider";
import { useParams, useRouter } from "next/navigation";
import {
  Company,
  getCompanyById,
  deleteCompany,
  getOpportunityByCompanyId,
  getTaskByCompanyId,
  getNoteByCompanyId,
  getQuoteByCompanyId,
  getAttachmentByCompanyId,
  getContactByCompanyId,
} from "@/app/services/company/company.service";
import { Contact } from "@/app/services/contact/contact.service";
import { Opportunity } from "@/app/services/opportunity/opportunity.service";
import { Task } from "@/app/services/task/task.service";
import { Notes } from "@/app/services/notes/notes.service";
import { Quote } from "@/app/services/quote/quote.service";
import { Attachment } from "@/app/services/attachment/attachement.service";
import DataTable, { TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";

// Import Create/Edit Forms
import CreateCompanyForm from "../create/page";
import CreateContactForm from "../../contact/create/page";
import CreateOpportunity from "../../opportunity/create/page";
import CreateTask from "../../tasks/create/page";
import CreateNote from "../../other/note/create/page";
import CreateQuote from "../../sales/qoutes/Create/page";
import CreateAttachmentForm from "../../other/attachment/create/page";

const tabs = [
  "Company Information",
  "Opportunities",
  "Tasks",
  "Notes",
  "Attachments",
  "Quotes",
  "Contacts",
];

export default function CompanyViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useError();
  const companyId = Number(params.id);

  const [activeTab, setActiveTab] = useState("Company Information");
  const [company, setCompany] = useState<Company | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Tab data states
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Loading and loaded tabs states
  const [tabLoading, setTabLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  // Create modal states
  const [openCreateContact, setOpenCreateContact] = useState(false);
  const [openCreateOpportunity, setOpenCreateOpportunity] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openCreateNote, setOpenCreateNote] = useState(false);
  const [openCreateQuote, setOpenCreateQuote] = useState(false);
  const [openCreateAttachment, setOpenCreateAttachment] = useState(false);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        const res = await getCompanyById(companyId);
        setCompany(res.data || null);
      } catch (error) {
        console.error("Failed to fetch company:", error);
        showError("Failed to fetch company details");
      }
    };

    fetchCompany();
  }, [companyId, showError]);

  // Fetch tab data based on active tab
  const fetchTabData = useCallback(
    async (tab: string, forceRefresh = false) => {
      if (!companyId || (loadedTabs.has(tab) && !forceRefresh)) return;

      setTabLoading(true);
      try {
        switch (tab) {
          case "Contacts":
            const contactRes = await getContactByCompanyId(companyId);
            setContacts(contactRes.data || []);
            break;
          case "Opportunities":
            const oppRes = await getOpportunityByCompanyId(companyId);
            setOpportunities(oppRes.data || []);
            break;
          case "Tasks":
            const taskRes = await getTaskByCompanyId(companyId);
            setTasks(taskRes.data || []);
            break;
          case "Notes":
            const notesRes = await getNoteByCompanyId(companyId);
            setNotes(notesRes.data || []);
            break;
          case "Quotes":
            const quotesRes = await getQuoteByCompanyId(companyId);
            setQuotes(quotesRes.data || []);
            break;
          case "Attachments":
            const attachRes = await getAttachmentByCompanyId(companyId);
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
    [companyId, loadedTabs],
  );

  // Fetch data when tab changes
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const handleDelete = async () => {
    if (!company) return;
    if (window.confirm(`Are you sure you want to delete "${company.name}"?`)) {
      try {
        await deleteCompany(companyId);
        showSuccess("Company deleted successfully");
        router.push("/company");
      } catch (error) {
        console.error("Failed to delete company:", error);
        showError("Failed to delete company");
      }
    }
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    router.push("/company");
  };

  // Handle create success - refresh the tab data
  const handleCreateSuccess = (tab: string) => {
    fetchTabData(tab, true);
  };

  // Get create button config based on active tab
  const getCreateButtonConfig = () => {
    switch (activeTab) {
      case "Contacts":
        return {
          label: "Create Contact",
          onClick: () => setOpenCreateContact(true),
        };
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
      default:
        return null;
    }
  };

  // Column definitions for each tab
  const contactColumns: TableColumn<Contact>[] = [
    {
      key: "name",
      label: "Name",
      visible: true,
      render: (row) => `${row.first_name} ${row.last_name}`,
    },
    { key: "email", label: "Email", visible: true },
    { key: "phone", label: "Phone", visible: true },
    { key: "job_title", label: "Job Title", visible: true },
    {
      key: "owner",
      label: "Owner",
      visible: true,
      render: (row) => row.owner?.name || "-",
    },
  ];

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
      case "Contacts":
        return (
          <DataTable
            columns={contactColumns}
            data={contacts}
            emptyMessage="No contacts found"
          />
        );
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
      default:
        return null;
    }
  };

  const createButtonConfig = getCreateButtonConfig();

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading company...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/company")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <span>&larr;</span>
          <span>Back to Companies</span>
        </button>
        <button
          onClick={() => setOpenEdit(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          Edit Company
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
              {company.name?.[0]?.toUpperCase() || "?"}
            </div>
            <h2 className="mt-3 font-semibold">{company.name}</h2>
            <p className="text-sm text-gray-500">
              {company.company_type?.name || "-"}
            </p>
            <p className="text-sm text-brand-500">
              {company.industry?.name || "-"}
            </p>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-gray-400">Company Owner</p>
              <p>{company.owner?.name || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p>{company.email || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p>{company.phone || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Website</p>
              <p>{company.website || "-"}</p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="mt-6 w-full border border-red-500 text-red-500 rounded-md py-1.5 text-sm hover:bg-red-50"
          >
            Delete Company
          </button>
        </div>

        {/* Right Details */}
        <div className="flex-1 space-y-6">
          {activeTab === "Company Information" ? (
            <>
              {/* Basic Info */}
              <Section title="Basic Information">
                <Field label="Company Name" value={company.name || "-"} />
                <Field label="Email" value={company.email || "-"} />
                <Field label="Phone" value={company.phone || "-"} />
                <Field label="Website" value={company.website || "-"} />
                <Field
                  label="Company Type"
                  value={company.company_type?.name || "-"}
                />
                <Field label="Industry" value={company.industry?.name || "-"} />
                <Field
                  label="Company Size"
                  value={company.company_size || "-"}
                />
                <Field
                  label="Annual Revenue"
                  value={company.annual_revenue || "-"}
                />
                <Field label="Owner" value={company.owner?.name || "-"} />
              </Section>

              {/* Billing Address */}
              <Section title="Billing Address">
                <Field
                  label="Street"
                  value={company.address?.billing_street || "-"}
                />
                <Field
                  label="City"
                  value={company.address?.billing_city || "-"}
                />
                <Field
                  label="State"
                  value={company.address?.billing_state || "-"}
                />
                <Field
                  label="ZIP Code"
                  value={company.address?.billing_zip || "-"}
                />
                <Field
                  label="Country"
                  value={company.address?.billing_country || "-"}
                />
              </Section>

              {/* Shipping Address */}
              <Section title="Shipping Address">
                <Field
                  label="Street"
                  value={company.address?.shipping_street || "-"}
                />
                <Field
                  label="City"
                  value={company.address?.shipping_city || "-"}
                />
                <Field
                  label="State"
                  value={company.address?.shipping_state || "-"}
                />
                <Field
                  label="ZIP Code"
                  value={company.address?.shipping_zip || "-"}
                />
                <Field
                  label="Country"
                  value={company.address?.shipping_country || "-"}
                />
              </Section>

              {/* Social Links */}
              <Section title="Social Links">
                <Field label="LinkedIn" value={company.linkedin || "-"} />
                <Field label="Twitter" value={company.twitter || "-"} />
                <Field label="Facebook" value={company.facebook || "-"} />
                <Field label="Instagram" value={company.instagram || "-"} />
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

      {/* Edit Company SlideOver */}
      <SlideOver
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        width="sm:w-[70vw] lg:w-[60vw]"
      >
        <CreateCompanyForm
          mode="edit"
          data={company}
          onClose={() => setOpenEdit(false)}
          onSuccess={handleEditSuccess}
        />
      </SlideOver>

      {/* Create Contact SlideOver */}
      <SlideOver
        open={openCreateContact}
        onClose={() => setOpenCreateContact(false)}
        width="sm:w-[70vw] lg:w-[60vw]"
      >
        <CreateContactForm
          mode="create"
          onClose={() => setOpenCreateContact(false)}
          onSuccess={() => {
            setOpenCreateContact(false);
            handleCreateSuccess("Contacts");
          }}
          defaultCompanyId={companyId}
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
          defaultCompanyId={companyId}
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
          defaultCompanyId={companyId}
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
          defaultCompanyId={companyId}
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
          defaultCompanyId={companyId}
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
          defaultCompanyId={companyId}
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
