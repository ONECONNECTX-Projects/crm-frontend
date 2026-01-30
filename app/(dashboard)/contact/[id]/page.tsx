"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Contact,
  deleteContact,
  getContactById,
} from "@/app/services/contact/contact.service";
import { useError } from "@/app/providers/ErrorProvider";
import SlideOver from "@/app/common/slideOver";
import CreateContactForm from "../create/page";

const tabs = [
  "Contact Information",
  "Opportunities",
  "Tasks",
  "Notes",
  "Attachments",
  "Emails",
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

  //

  useEffect(() => {
    if (!contactId) return;

    const fetchContact = async () => {
      try {
        const res = await getContactById(contactId);
        setContact(res.data || null); // ← API response
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        showError("Failed to fetch staff details");
      }
    };

    fetchContact();
  }, [contactId, showError]);

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
        <div className="w-1/4 bg-white rounded-xl p-5 shadow-sm">
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
          {/* Basic Info */}
          <Section title="Basic Information">
            <Field label="First Name" value={contact.first_name || "-"} />
            <Field label="Last Name" value={contact.last_name || "-"} />
            <Field label="Email" value={contact.email || "-"} />
            <Field label="Phone" value={contact.phone || "-"} />
            <Field label="Birthday" value={contact.birthday || "-"} />
            <Field label="Job Title" value={contact.job_title || "-"} />
            <Field label="Company" value={contact.company?.name || "-"} />
            <Field label="Department" value={contact.department?.name || "-"} />
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
            <Field label="City" value={contact.address?.present_city || "-"} />
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
        </div>
      </div>

      {/* Edit SlideOver */}
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
