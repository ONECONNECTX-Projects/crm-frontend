"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/app/common/StatusBadge";
import {
  Role,
  Permission,
  getPermissionsByRoleId,
  assignPermissionsToRole,
} from "@/app/services/roles/roles.service";

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

export default function ViewRolePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<Permission[]>(
    []
  );

  useEffect(() => {
    // Get role data from search params
    const roleData = searchParams.get("data");
    if (roleData) {
      try {
        const parsedRole = JSON.parse(decodeURIComponent(roleData)) as Role;
        setRole(parsedRole);
      } catch (error) {
        console.error("Failed to parse role data:", error);
      }
    }

    // Fetch permissions from API
    const fetchPermissions = async () => {
      try {
        const permResponse = await getPermissionsByRoleId(Number(params.id));
        setPermissions(permResponse.data || []);
        setOriginalPermissions(permResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [params.id, searchParams]);

  /* ---------- HANDLE PERMISSION CHANGE ---------- */
  const handlePermissionChange = (
    moduleIndex: number,
    permissionType: "can_read" | "can_create" | "can_update" | "can_delete"
  ) => {
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
    const allSelected =
      currentModule.can_read &&
      currentModule.can_create &&
      currentModule.can_update &&
      currentModule.can_delete;

    setPermissions((prev) =>
      prev.map((perm, index) =>
        index === moduleIndex
          ? {
              ...perm,
              can_read: !allSelected,
              can_create: !allSelected,
              can_update: !allSelected,
              can_delete: !allSelected,
            }
          : perm
      )
    );
  };

  /* ---------- SELECT ALL PERMISSIONS ---------- */
  const handleSelectAll = () => {
    const allSelected = permissions.every(
      (perm) =>
        perm.can_read && perm.can_create && perm.can_update && perm.can_delete
    );
    setPermissions((prev) =>
      prev.map((perm) => ({
        ...perm,
        can_read: !allSelected,
        can_create: !allSelected,
        can_update: !allSelected,
        can_delete: !allSelected,
      }))
    );
  };

  /* ---------- SAVE PERMISSIONS ---------- */
  const handleSavePermissions = async () => {
    // await api.patch(`roles/${params.id}/permissions`, { permissions });
    await assignPermissionsToRole({
      role_id: Number(params.id),
      permissions: permissions,
    });
    setOriginalPermissions(permissions);
    setEditMode(false);
  };

  /* ---------- CANCEL EDIT ---------- */
  const handleCancelEdit = () => {
    setPermissions(originalPermissions);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                {role.name}
              </h1>
              <StatusBadge
                status={role.is_active ? "active" : "inactive"}
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
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
            <p className="text-sm text-brand-500 font-medium">Permissions</p>
            <p className="text-2xl font-semibold text-brand-600 mt-1">
              {role.permissionsCount || permissions.length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Users Assigned</p>
            <p className="text-2xl font-semibold text-green-900 mt-1">
              {role.usersCount || 0}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Created</p>
            <p className="text-2xl font-semibold text-purple-900 mt-1">
              {formatDate(role.createdAt || "")}
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
                className="text-sm text-brand-500 hover:text-brand-500 font-medium"
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
                  {editMode && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      All
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission, index) => (
                  <tr key={permission.module_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {permission.module_name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editMode ? (
                        <input
                          type="checkbox"
                          checked={permission.can_read}
                          onChange={() =>
                            handlePermissionChange(index, "can_read")
                          }
                          className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.can_read ? (
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
                          checked={permission.can_create}
                          onChange={() =>
                            handlePermissionChange(index, "can_create")
                          }
                          className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.can_create ? (
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
                          checked={permission.can_update}
                          onChange={() =>
                            handlePermissionChange(index, "can_update")
                          }
                          className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.can_update ? (
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
                          checked={permission.can_delete}
                          onChange={() =>
                            handlePermissionChange(index, "can_delete")
                          }
                          className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                        />
                      ) : permission.can_delete ? (
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
                    {editMode && (
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={
                            permission.can_read &&
                            permission.can_create &&
                            permission.can_update &&
                            permission.can_delete
                          }
                          onChange={() => handleSelectAllModule(index)}
                          className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
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
