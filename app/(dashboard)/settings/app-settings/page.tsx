"use client";

import { useState } from "react";

export default function AppSettingsPage() {
  const [form, setForm] = useState({
    name: "OS",
    host: "mail.osapp.net",
    port: "465",
    email: "no-reply@osapp.net",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">App Settings</h1>
        <p className="text-sm text-gray-500">
          Here you can configure the app settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <button className="text-sm text-brand-500 font-medium border-b-2 border-brand-500 pb-2">
          Email Config
        </button>
      </div>

      {/* Form Container */}
      <div className="max-w-xl mx-auto">
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email config name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Host</label>
            <input
              name="host"
              value={form.host}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Port</label>
            <input
              name="port"
              value={form.port}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              User email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Save Button */}
          <div>
            <button className="bg-brand-500 text-white px-6 py-2 rounded-md text-sm hover:bg-brand-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
