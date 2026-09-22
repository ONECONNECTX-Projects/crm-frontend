"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  FolderPlus,
  Search,
  Loader2,
  FolderUp,
  File,
  Folder,
  Image as ImageIcon,
  Trash2,
  Edit2,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
} from "lucide-react";
import {
  Media,
  getAllMedia,
  uploadMedia,
  deleteMedia,
  renameMedia,
  createFolder,
} from "@/app/services/media/media.service";
import { useError } from "@/app/providers/ErrorProvider";
import { api } from "@/app/utils/apiClient";

export default function MediaPage() {
  const { showSuccess, showError } = useError();
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Media[]>([]);
  const [search, setSearch] = useState("");

  // Modal states
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Rename state
  const [renamingItem, setRenamingItem] = useState<Media | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Set webkitdirectory and directory attributes imperatively
  useEffect(() => {
    if (folderInputRef.current) {
      (folderInputRef.current as any).webkitdirectory = true;
      (folderInputRef.current as any).directory = true;
    }
  }, [folderInputRef]);

  // Fetch media items
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await getAllMedia(currentFolderId);
      setItems(response.data || []);
    } catch (error) {
      console.error("Failed to fetch media:", error);
      showError("Failed to load media files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [currentFolderId]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      await uploadMedia(Array.from(files), currentFolderId);
      showSuccess("Files uploaded successfully");
      fetchMedia();
    } catch (error) {
      console.error("Failed to upload files:", error);
      showError("Failed to upload files");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Handle folder upload
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      const formData = new FormData();
      const filePaths: string[] = [];

      Array.from(files).forEach((file) => {
        const relativePath = (file as any).webkitRelativePath || file.name;
        formData.append("files", file);
        filePaths.push(relativePath); // Store paths separately
      });

      // Send paths as JSON string
      formData.append("file_paths", JSON.stringify(filePaths));

      if (currentFolderId) {
        formData.append("parent_id", currentFolderId.toString());
      }

      await api.post("media/upload", formData);
      showSuccess("Folder uploaded successfully");
      fetchMedia();
    } catch (error) {
      console.error("Failed to upload folder:", error);
      showError("Failed to upload folder");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Handle create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      showError("Folder name is required");
      return;
    }

    try {
      setCreatingFolder(true);
      await createFolder(newFolderName, currentFolderId);
      showSuccess("Folder created successfully");
      setNewFolderName("");
      setShowCreateFolder(false);
      fetchMedia();
    } catch (error) {
      console.error("Failed to create folder:", error);
      showError("Failed to create folder");
    } finally {
      setCreatingFolder(false);
    }
  };

  // Handle delete
  const handleDelete = async (item: Media) => {
    const itemType = item.type === "folder" ? "folder" : "file";
    if (!window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      return;
    }

    try {
      await deleteMedia(item);
      showSuccess(
        `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`,
      );
      fetchMedia();
    } catch (error) {
      console.error("Failed to delete:", error);
      showError(`Failed to delete ${itemType}`);
    }
  };

  // Handle rename
  const handleRename = async () => {
    if (!renamingItem || !renameValue.trim()) {
      showError("Name is required");
      return;
    }

    try {
      await renameMedia(renamingItem.id, renameValue);
      showSuccess("Renamed successfully");
      setRenamingItem(null);
      setRenameValue("");
      fetchMedia();
    } catch (error) {
      console.error("Failed to rename:", error);
      showError("Failed to rename");
    }
  };

  // Navigate into folder
  const navigateToFolder = (folder: Media) => {
    setBreadcrumbs((prev) => [...prev, folder]);
    setCurrentFolderId(folder.id);
  };

  // Navigate back
  const handleGoBack = () => {
    if (breadcrumbs.length === 0) return;

    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs.pop();
    setBreadcrumbs(newBreadcrumbs);

    if (newBreadcrumbs.length === 0) {
      setCurrentFolderId(null);
    } else {
      setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    }
  };

  // Navigate to specific breadcrumb
  const navigateToBreadcrumb = (index: number) => {
    if (index < 0) {
      setBreadcrumbs([]);
      setCurrentFolderId(null);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentFolderId(newBreadcrumbs[index].id);
    }
  };

  // Icon + tint per file kind, rendered as a chip so the list scans by shape.
  const getFileIcon = (item: Media) => {
    const chip = "flex size-8 shrink-0 items-center justify-center rounded-lg";
    const mimeType = item.mime_type || "";

    if (item.type === "folder") {
      return (
        <span className={`${chip} bg-brand-50 text-brand-500`}>
          <Folder className="size-4" />
        </span>
      );
    }
    if (mimeType.startsWith("image/")) {
      return (
        <span className={`${chip} bg-emerald-50 text-emerald-600`}>
          <ImageIcon className="size-4" />
        </span>
      );
    }
    if (mimeType.startsWith("video/")) {
      return (
        <span className={`${chip} bg-violet-50 text-violet-600`}>
          <FileVideo className="size-4" />
        </span>
      );
    }
    if (mimeType.startsWith("audio/")) {
      return (
        <span className={`${chip} bg-pink-50 text-pink-600`}>
          <FileAudio className="size-4" />
        </span>
      );
    }
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      return (
        <span className={`${chip} bg-emerald-50 text-emerald-700`}>
          <FileSpreadsheet className="size-4" />
        </span>
      );
    }
    if (mimeType.includes("pdf") || mimeType.includes("document")) {
      return (
        <span className={`${chip} bg-red-50 text-red-600`}>
          <FileText className="size-4" />
        </span>
      );
    }
    return (
      <span className={`${chip} bg-brand-50 text-brand-500`}>
        <File className="size-4" />
      </span>
    );
  };

  // Format file size
  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  // Handle download
  const handleDownload = async (item: Media) => {
    if (item?.path) {
      // Create a temporary anchor to trigger download
      const link = document.createElement("a");
      link.href = item.path;
      link.download = item.path || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const folders = items.filter((i) => i.type === "folder");
  const visibleItems = search.trim()
    ? items.filter((i) =>
        i.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : items;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Media
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your files and folders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label
            className={`flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted ${
              uploading ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
          >
            <FolderUp className="size-4" />
            Upload Folder
            <input
              ref={folderInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFolderUpload}
              disabled={uploading}
            />
          </label>

          <label
            className={`flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 ${
              uploading ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
          >
            <Upload className="size-4" />
            {uploading ? "Uploading..." : "Upload Files"}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            <FolderPlus className="size-4" />
            New Folder
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[16rem_1fr] sm:gap-6">
        {/* Folder rail */}
        <div className="h-fit rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Folders
          </h2>
          <button
            onClick={() => {
              setBreadcrumbs([]);
              setCurrentFolderId(null);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              currentFolderId === null
                ? "bg-brand-50 font-medium text-brand-600"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Folder className="size-4" />
            Root
          </button>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => navigateToFolder(folder)}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <Folder className="size-4 shrink-0" />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}
        </div>

        {/* File list — one card: breadcrumb, search, table, footer */}
        <div className="rounded-xl border border-border bg-card px-4 shadow-sm sm:px-6">
          {/* Breadcrumb + search */}
          <div className="flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              <button
                onClick={handleGoBack}
                disabled={breadcrumbs.length === 0}
                className="mr-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
                title="Back"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                className="font-medium text-brand-500 hover:underline"
                onClick={() => navigateToBreadcrumb(-1)}
              >
                Root
              </button>
              {breadcrumbs.map((folder, index) => (
                <span key={folder.id} className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">/</span>
                  <button
                    className="font-medium text-brand-500 hover:underline"
                    onClick={() => navigateToBreadcrumb(index)}
                  >
                    {folder.name}
                  </button>
                </span>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files and folders..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Type", "Size", "Modified", ""].map((label, i) => (
                    <th
                      key={i}
                      className={`whitespace-nowrap py-3 text-xs font-semibold uppercase tracking-wide text-brand-700 ${
                        i === 4 ? "text-right" : "text-left"
                      }`}
                    >
                      {label || "Actions"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Loader2 className="mx-auto size-8 animate-spin text-brand-500" />
                    </td>
                  </tr>
                ) : visibleItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-brand-50">
                        <Folder className="size-7 text-brand-400" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {search ? "No matches" : "No files or folders"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {search
                          ? "Try a different search term."
                          : "Upload a file to get started."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  visibleItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 pr-4">
                        <div
                          className={`flex items-center gap-3 ${
                            item.type === "folder" ? "cursor-pointer" : ""
                          }`}
                          onDoubleClick={() =>
                            item.type === "folder" && navigateToFolder(item)
                          }
                        >
                          {getFileIcon(item)}
                          {renamingItem?.id === item.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                className="rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/20"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleRename();
                                  if (e.key === "Escape") {
                                    setRenamingItem(null);
                                    setRenameValue("");
                                  }
                                }}
                              />
                              <button
                                onClick={handleRename}
                                className="text-xs font-medium text-brand-500 hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setRenamingItem(null);
                                  setRenameValue("");
                                }}
                                className="text-xs font-medium text-muted-foreground hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`truncate font-medium ${
                                item.type === "folder"
                                  ? "text-brand-600"
                                  : "text-foreground"
                              }`}
                            >
                              {item.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {item.type === "folder" ? "Folder" : "File"}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {item.type === "folder" ? "—" : formatSize(item.size)}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {formatDate(item.updatedAt)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          {item.type === "file" && (
                            <button
                              onClick={() => handleDownload(item)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-600"
                              title="Download"
                            >
                              <Download className="size-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setRenamingItem(item);
                              setRenameValue(item.name);
                            }}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Rename"
                          >
                            <Edit2 className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border py-3 text-xs text-muted-foreground">
            <span>
              Showing {visibleItems.length} of {items.length} item
              {items.length === 1 ? "" : "s"}
            </span>
            <span>
              {loading ? "Loading..." : uploading ? "Uploading..." : "Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Create New Folder
              </h3>
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/20"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={creatingFolder}
                className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {creatingFolder ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
