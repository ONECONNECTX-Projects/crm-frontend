"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  owner: string;
  status: string;
  source: string;
}

const mockLeads: Lead[] = [
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "Working",
    source: "Referral",
  },
];

const leadStatusOptions = ["New", "Working", "Qualified", "Lost"];
const leadSources = ["Web", "Referral", "Cold Call", "Email Campaign"];

export default function LeadViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const found = mockLeads.find((l) => l.id === id);
    setLead(found ?? null);
  }, [id]);

  if (!lead) {
    return (
      <div className="p-10 text-center text-gray-500">Lead not found.</div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-white rounded-xl shadow-md  mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {lead.name}
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
          >
            Close
          </button>

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Convert
          </button>

          <button className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Lead Owner */}
        <div>
          <label className="text-sm text-gray-600">Lead Owner</label>
          <Select defaultValue={lead.owner}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Mr. Admin", "Mr. Salesman"].map((v: string) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lead Source */}
        <div>
          <label className="text-sm text-gray-600">Lead Source</label>
          <Select defaultValue={lead.source}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {leadSources.map((v: string) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lead Status */}
        <div>
          <label className="text-sm text-gray-600">Lead Status</label>
          <Select defaultValue={lead.status}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {leadStatusOptions.map((v: string) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lead Name */}
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-gray-900">{lead.name}</p>
            <span className="cursor-pointer text-gray-500 hover:text-gray-700">
              ✏️
            </span>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone Number</label>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-gray-900">{lead.phone}</p>
            <span className="cursor-pointer text-gray-500 hover:text-gray-700">
              ✏️
            </span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-gray-900">{lead.email}</p>
            <span className="cursor-pointer text-gray-500 hover:text-gray-700">
              ✏️
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
