"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/app/common/StatusBadge";

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

interface RoleDetails {
  id: number;
  name: string;
  description: string;
  permissionsCount: number;
  usersCount: number;
  status: "active" | "inactive";
  createdAt: string;
  permissions: Permission[];
}

const statusColorMap = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

// Mock data for demonstration
const mockRole: RoleDetails = {
  id: 1,
  name: "Sales Manager",
  description: "Manage sales team and operations",
  permissionsCount: 25,
  usersCount: 5,
  status: "active",
  createdAt: "Jan 15, 2024",
  permissions: [
    { module: "Dashboard", view: true, create: false, edit: false, delete: false, export: true },
    { module: "Contacts", view: true, create: true, edit: true, delete: true, export: true },
    { module: "Leads", view: true, create: true, edit: true, delete: true, export: true },
    { module: "Opportunities", view: true, create: true, edit: true, delete: true, export: true },
    { module: "Companies", view: true, create: true, edit: true, delete: false, export: true },
    { module: "Products", view: true, create: false, edit: false, delete: false, export: true },
    { module: "Tasks", view: true, create: true, edit: true, delete: true, export: false },
    { module: "Tickets", view: true, create: false, edit: false, delete: false, export: false },
    { module: "Projects", view: true, create: false, edit: false, delete: false, export: false },
    { module: "Reports", view: true, create: false, edit: false, delete: false, export: true },
    { module: "Settings", view: false, create: false, edit: false, delete: false, export: false },
    { module: "Users", view: false, create: false, edit: false, delete: false, export: false },
  ],
};

export default function ViewRolePage() {
  const router = useRouter();
  const params = useParams();
  const [role, setRole] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setRole(mockRole);
      setPermissions(mockRole.permissions);
      setLoading(false);
    }, 500);

    // In production, replace with actual API call:
    // fetch(`/api/roles/${params.id}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setRole(data);
    //     setPermissions(data.permissions);
    //   })
    //   .finally(() => setLoading(false));
  }, [params.id]);

  /* ---------- HANDLE PERMISSION CHANGE ---------- */
  const handlePermissionChange = (moduleIndex: number, permissionType: keyof Omit<Permission, "module">) => {
    setPermissions((prev) =>
      prev.map((perm, index) =>
        index === moduleIndex
          ? { ...perm, [permissionType]: !perm[permissionType] }
          : perm
      )
    );
  };

  /* ---------- SELECT ALL FOR MODULE ---------- */
  const handleSelectAllModule = (moduleIndex: number) => {
    const currentModule = permissions[moduleIndex];
    const allSelected = currentModule.view && currentModule.create && currentModule.edit && currentModule.delete && currentModule.export;

    setPermissions((prev) =>
      prev.map((perm, index) =>
        index === moduleIndex
          ? { ...perm, view: !allSelected, create: !allSelected, edit: !allSelected, delete: !allSelected, export: !allSelected }
          : perm
      )
    );
  };

  /* ---------- SELECT ALL PERMISSIONS ---------- */
  const handleSelectAll = () => {
    const allSelected = permissions.every(perm => perm.view && perm.create && perm.edit && perm.delete && perm.export);
    setPermissions((prev) =>
      prev.map((perm) => ({
        ...perm,
        view: !allSelected,
        create: !allSelected,
        edit: !allSelected,
        delete: !allSelected,
        export: !allSelected,
      }))
    );
  };

  /* ---------- SAVE PERMISSIONS ---------- */
  const handleSavePermissions = async () => {
    // In production, save to API:
    // await fetch(`/api/roles/${params.id}/permissions`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ permissions }),
    // });

    if (role) {
      setRole({ ...role, permissions });
    }
    setEditMode(false);
  };

  /* ---------- CANCEL EDIT ---------- */
  const handleCancelEdit = () => {
    if (role) {
      setPermissions(role.permissions);
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white rounded-xl p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-white rounded-xl p-6">
        <p className="text-sm text-gray-500">Role not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">{role.name}</h1>
              <StatusBadge
                status={role.status}
                colorMap={statusColorMap}
                variant="default"
              />
            </div>
            <p className="text-sm text-gray-600">{role.description}</p>
          </div>
          <div className="flex gap-3">
            {!editMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/settings/employee-manage/roles")}
                >
                  Back to Roles
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/settings/employee-manage/roles/${role.id}/edit`)}
                >
                  Edit Role
                </Button>
                <Button onClick={() => setEditMode(true)}>
                  Edit Permissions
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSavePermissions}>
                  Save Permissions
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Permissions</p>
            <p className="text-2xl font-semibold text-blue-900 mt-1">
              {role.permissionsCount}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Users Assigned</p>
            <p className="text-2xl font-semibold text-green-900 mt-1">
              {role.usersCount}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Created</p>
            <p className="text-2xl font-semibold text-purple-900 mt-1">
              {role.createdAt}
            </p>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Role Permissions
            </h2>
            {editMode && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Select All
              </button>
            )}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Create
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delete
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Export
                  </th>
                  {editMode && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      All
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(editMode ? permissions : role.permissions).map((permission, index) => (
                  <tr key={permission.module} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {permission.module}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editMode ? (
                        <input
                          type="checkbox"
                          checked={permission.view}
                          onChange={() => handlePermissionChange(index, "view")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.view ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full">
                          <svg
                            className="w-3 h-3 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editMode ? (
                        <input
                          type="checkbox"
                          checked={permission.create}
                          onChange={() => handlePermissionChange(index, "create")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.create ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editMode ? (
                        <input
                          type="checkbox"
                          checked={permission.edit}
                          onChange={() => handlePermissionChange(index, "edit")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.edit ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editMode ? (
                        <input
                          type="checkbox"
                          checked={permission.delete}
                          onChange={() => handlePermissionChange(index, "delete")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.delete ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editMode ? (
                        <input
                          type="checkbox"
                          checked={permission.export}
                          onChange={() => handlePermissionChange(index, "export")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.export ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </td>
                    {editMode && (
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={permission.view && permission.create && permission.edit && permission.delete && permission.export}
                          onChange={() => handleSelectAllModule(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}