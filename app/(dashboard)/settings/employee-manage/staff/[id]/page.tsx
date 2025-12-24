"use client";

import { useParams } from "next/navigation";
import { Mail, Phone, User, Briefcase, Calendar } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  role: string;
  designation?: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  employeeId: string;
  address: string;
  bloodGroup: string;
  shift: string;
}

/* 🔹 Mock fetch (replace with API later) */
const getStaffById = (id: string): Staff => ({
  id,
  name: "Staff",
  role: "admin",
  designation: "No Designation",
  department: "Demo Department",
  email: "staff@gmail.com",
  phone: "01700000000",
  joinDate: "15/01/2022",
  employeeId: "007",
  address: "Street: Gulshan, City: Dhaka, Country: Bangladesh",
  bloodGroup: "B+",
  shift: "Demo Shift (10AM - 7PM)",
});

export default function StaffViewPage() {
  const params = useParams();
  const staff = getStaffById(params.id as string);

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="bg-white rounded-xl p-6">
        <h1 className="text-xl font-semibold">{staff.name}</h1>

        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span>{staff.designation}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
            {staff.role}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-sm">
          <Info icon={<Mail size={16} />} label="Email" value={staff.email} />
          <Info
            icon={<User size={16} />}
            label="Employee ID"
            value={staff.employeeId}
          />
          <Info icon={<Phone size={16} />} label="Phone" value={staff.phone} />
          <Info
            icon={<Calendar size={16} />}
            label="Join Date"
            value={staff.joinDate}
          />
          <Info
            icon={<Briefcase size={16} />}
            label="Department"
            value={staff.department}
          />
        </div>
      </div>

      {/* ================= Detailed Information ================= */}
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4">Detailed Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal */}
          <Section title="Personal Information">
            <Item label="Department" value={staff.department} />
            <Item label="Employee Status" value="Demo Employment" />
            <Item label="Join Date" value={staff.joinDate} />
            <Item label="Role" value={staff.role} />
            <Item label="Shift" value={staff.shift} />
          </Section>

          {/* Contact */}
          <Section title="Contact Information">
            <Item label="Email" value={staff.email} />
            <Item label="Phone" value={staff.phone} />
            <Item label="Address" value={staff.address} />
            <Item label="Blood Group" value={staff.bloodGroup} />
          </Section>
        </div>
      </div>

      {/* ================= History Cards ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        <HistoryCard title="Designation History" />
        <HistoryCard title="Education History" />
        <HistoryCard title="Salary History" />
        <HistoryCard title="Award History" />
      </div>
    </div>
  );
}

/* ================= Reusable Components ================= */

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 border-b pb-2">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function HistoryCard({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl p-6 text-center">
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <p className="text-xs text-gray-400 mb-4">No {title} Found</p>
      <button className="text-sm text-blue-600 border border-blue-600 px-4 py-1.5 rounded hover:bg-blue-50">
        Click on edit button to add new
      </button>
    </div>
  );
}
