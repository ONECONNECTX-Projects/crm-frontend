"use client";

import { useState, useEffect } from "react";
import { useError } from "@/app/providers/ErrorProvider";
import {
  EmailConfig,
  getAllEmailConfig,
  createEmailConfig,
  updateEmailConfig,
} from "@/app/services/email-config/email-config.service";

export default function AppSettingsPage() {
  const { showSuccess, showError } = useError();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingConfig, setExistingConfig] = useState<EmailConfig | null>(null);
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  const fetchEmailConfig = async () => {
    try {
      setLoading(true);
      const response = await getAllEmailConfig();
      const configData = response.data;
      const config = Array.isArray(configData) ? configData[0] : configData;
      if (response.isSuccess && config) {
        setExistingConfig(config);
        setForm({
          name: config.name || "",
          host: config.host || "",
          port: config.port || "",
          email: config.email || "",
          password: config.password || "",
        });
      }
    } catch {
      // Global error handler will show the toast
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (existingConfig) {
        const payload = { ...existingConfig, ...form } as EmailConfig;
        const response = await updateEmailConfig(payload);
        if (response.isSuccess) {
          showSuccess("Email config updated successfully");
          if (response.data) setExistingConfig(response.data);
        }
      } else {
        const response = await createEmailConfig(form as unknown as EmailConfig);
        if (response.isSuccess) {
          showSuccess("Email config created successfully");
          if (response.data) setExistingConfig(response.data);
        }
      }
    } catch {
      showError("Failed to save email config");
    } finally {
      setSaving(false);
    }
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
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="mx-auto">
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
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-brand-500 text-white px-6 py-2 rounded-md text-sm hover:bg-brand-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
