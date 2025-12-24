"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function CompanySettingsPage() {
  const [logo, setLogo] = useState<File | null>(null);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Company Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your company information and branding
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border p-6 space-y-8">
        {/* Company Information */}
        <section>
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            Company Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="OS CRM"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tagline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="OS CRM"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="House: 139, Road: 13, Sector: 10, Uttara, Dhaka-1230"
            />
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="+880 18 2021 5555"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="solution@omega.ac"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Website
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="https://solution.omega.ac"
            />
          </div>
        </section>

        {/* Legal Information */}
        <section>
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            Legal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                BIN
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Enter BIN"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Musak
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Enter musak"
              />
            </div>
          </div>
        </section>

        {/* Branding */}
        <section>
          <h2 className="text-sm font-medium text-gray-800 mb-4">Branding</h2>

          <div className="border border-dashed rounded-lg p-4 flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-md">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-blue-600 cursor-pointer">
                Upload Company Logo
                <input
                  type="file"
                  hidden
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                />
              </label>
              <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </section>

        {/* Footer Content */}
        <section>
          <h2 className="text-sm font-medium text-gray-800 mb-2">
            Footer Content <span className="text-red-500">*</span>
          </h2>
          <textarea
            rows={4}
            className="w-full border rounded-md px-3 py-2 text-sm"
            defaultValue="OS CRM copyright by Omega Solution LLC"
          />
        </section>

        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <button className="bg-blue-600 text-white px-8 py-2 rounded-md text-sm hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
