"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

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
  const contactId = params.id;
  const [activeTab, setActiveTab] = useState("Contact Information");

  // Mock contact (replace with API later)
  const contact = {
    name: "Sara Khan",
    role: "Head of Procurement",
    company: "GreenFields Agro",
    owner: "Mrs. Manager",
    email: "sara.khan@greenfields.example",
    phone: "5550003303",
    dob: "1985-03-30",
    industry: "Biotechnology",
    stage: "Lead",
    source: "Email Campaign",
    department: "Supply Chain",
    linkedin: "https://www.linkedin.com/in/sarakhan",
    twitter: "https://twitter.com/sara_khan",
    address: {
      street: "42 Harvest Rd",
      city: "Lahore",
      zip: "54000",
      state: "Punjab",
      country: "Pakistan",
    },
    description: "Procurement lead at GreenFields Agro.",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
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
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
              {contact.name[0]}
            </div>
            <h2 className="mt-3 font-semibold">{contact.name}</h2>
            <p className="text-sm text-gray-500">{contact.role}</p>
            <p className="text-sm text-blue-600">{contact.company}</p>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-gray-400">Contact Owner</p>
              <p>{contact.owner}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p>{contact.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p>{contact.phone}</p>
            </div>
            <div>
              <p className="text-gray-400">Job Title</p>
              <p>{contact.role}</p>
            </div>
          </div>

          <button className="mt-6 w-full border border-red-500 text-red-500 rounded-md py-1.5 text-sm hover:bg-red-50">
            Delete Contact
          </button>
        </div>

        {/* Right Details */}
        <div className="flex-1 space-y-6">
          {/* Basic Info */}
          <Section title="Basic Information">
            <Field label="Date of Birth" value={contact.dob} />
            <Field label="Company" value={contact.company} />
            <Field label="Industry" value={contact.industry} />
            <Field label="Stage" value={contact.stage} />
            <Field label="Source" value={contact.source} />
            <Field label="Department" value={contact.department} />
          </Section>

          {/* Address */}
          <Section title="Present Address">
            <Field label="Street" value={contact.address.street} />
            <Field label="City" value={contact.address.city} />
            <Field label="ZIP Code" value={contact.address.zip} />
            <Field label="State" value={contact.address.state} />
            <Field label="Country" value={contact.address.country} />
          </Section>

          {/* Social */}
          <Section title="Social Links">
            <Field label="LinkedIn" value={contact.linkedin} />
            <Field label="Twitter" value={contact.twitter} />
          </Section>

          {/* Description */}
          <Section title="Description">
            <p className="text-sm text-gray-700">{contact.description}</p>
          </Section>
        </div>
      </div>
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
