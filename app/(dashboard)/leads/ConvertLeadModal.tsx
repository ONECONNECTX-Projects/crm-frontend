"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { useError } from "@/app/providers/ErrorProvider";
import {
  Leads,
  ConvertLeadModel,
  convertLeadToContact,
} from "@/app/services/lead/lead.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveCompany } from "@/app/services/company/company.service";
import { getAllActiveDepartment } from "@/app/services/department/departments.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";

interface ConvertLeadModalProps {
  open: boolean;
  onClose: () => void;
  lead: Leads | null;
  onSuccess: () => void;
}

export default function ConvertLeadModal({
  open,
  onClose,
  lead,
  onSuccess,
}: ConvertLeadModalProps) {
  const { showSuccess, showError } = useError();
  const [loading, setLoading] = useState(false);

  // Dropdown options
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [departments, setDepartments] = useState<OptionDropDownModel[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birthday: "",
    owner_id: "",
    company_id: "",
    job_title: "",
    department_id: "",
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [ownersRes, companiesRes, departmentsRes] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompany(),
          getAllActiveDepartment(),
        ]);
        setOwners(ownersRes.data || []);
        setCompanies(companiesRes.data || []);
        setDepartments(departmentsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  // Pre-fill form when lead changes
  useEffect(() => {
    if (lead) {
      const nameParts = lead.name?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        first_name: firstName,
        last_name: lastName,
        email: lead.email || "",
        phone: lead.phone || "",
        birthday: "",
        owner_id: lead.lead_owner_id?.toString() || "",
        company_id: "",
        job_title: "",
        department_id: "",
      });
    }
  }, [lead]);

  const handleSubmit = async () => {
    if (!lead) return;

    // Validation
    if (!formData.first_name.trim()) {
      showError("First name is required");
      return;
    }
    if (!formData.last_name.trim()) {
      showError("Last name is required");
      return;
    }
    if (!formData.email.trim()) {
      showError("Email is required");
      return;
    }
    if (!formData.owner_id) {
      showError("Owner is required");
      return;
    }
    if (!formData.company_id) {
      showError("Company is required");
      return;
    }
    if (!formData.department_id) {
      showError("Department is required");
      return;
    }

    setLoading(true);
    try {
      const payload: ConvertLeadModel = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        birthday: formData.birthday ? new Date(formData.birthday) : new Date(),
        owner_id: parseInt(formData.owner_id),
        company_id: parseInt(formData.company_id),
        job_title: formData.job_title,
        department_id: parseInt(formData.department_id),
      };

      await convertLeadToContact(lead.id, payload);
      showSuccess("Lead converted to contact successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to convert lead:", error);
      showError("Failed to convert lead to contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-brand-700">
            Convert Lead to Contact
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to convert this lead into a contact
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* First Name */}
          <InputField
            label="First Name"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={(v) => setFormData({ ...formData, first_name: v })}
          />

          {/* Last Name */}
          <InputField
            label="Last Name"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={(v) => setFormData({ ...formData, last_name: v })}
          />

          {/* Email */}
          <InputField
            label="Email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(v) => setFormData({ ...formData, email: v })}
          />

          {/* Phone */}
          <InputField
            label="Phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(v) => setFormData({ ...formData, phone: v })}
          />

          {/* Birthday */}
          <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">
              Birthday
            </label>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Job Title */}
          <InputField
            label="Job Title"
            placeholder="Enter job title"
            value={formData.job_title}
            onChange={(v) => setFormData({ ...formData, job_title: v })}
          />

          {/* Owner */}
          <SelectDropdown
            label="Owner"
            value={formData.owner_id}
            onChange={(v) => setFormData({ ...formData, owner_id: v })}
            options={owners.map((owner) => ({
              label: owner.name,
              value: owner.id,
            }))}
            placeholder="Select Owner"
          />

          {/* Company */}
          <SelectDropdown
            label="Company"
            value={formData.company_id}
            onChange={(v) => setFormData({ ...formData, company_id: v })}
            options={companies.map((company) => ({
              label: company.name,
              value: company.id,
            }))}
            placeholder="Select Company"
          />

          {/* Department */}
          <div className="md:col-span-2">
            <SelectDropdown
              label="Department"
              value={formData.department_id}
              onChange={(v) => setFormData({ ...formData, department_id: v })}
              options={departments.map((dept) => ({
                label: dept.name,
                value: dept.id,
              }))}
              placeholder="Select Department"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Converting..." : "Convert to Contact"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
