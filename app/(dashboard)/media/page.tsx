"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  FolderUp,
  File,
  Folder,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Plus,
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
  uploadFolder,
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

  // Modal states
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Rename state
  const [renamingItem, setRenamingItem] = useState<Media | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

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

  // Get file icon based on mime type
  const getFileIcon = (item: Media) => {
    if (item.type === "folder") {
      return <Folder className="w-7 h-7 text-yellow-600" />;
    }

    const mimeType = item.mime_type || "";

    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="w-7 h-7 text-green-600" />;
    }
    if (mimeType.startsWith("video/")) {
      return <FileVideo className="w-7 h-7 text-purple-600" />;
    }
    if (mimeType.startsWith("audio/")) {
      return <FileAudio className="w-7 h-7 text-pink-600" />;
    }
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      return <FileSpreadsheet className="w-7 h-7 text-green-700" />;
    }
    if (mimeType.includes("pdf") || mimeType.includes("document")) {
      return <FileText className="w-7 h-7 text-red-600" />;
    }

    return <File className="w-7 h-7 text-gray-600" />;
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
  const handleDownload = (item: Media) => {
    if (item.path) {
      window.open(item.path, "_blank");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#d1d5db]">
      {/* Top Toolbar */}
      <div className="flex items-center gap-5 px-6 py-4 bg-[#3f454a] text-white text-lg">
        <button
          onClick={handleGoBack}
          disabled={breadcrumbs.length === 0}
          className={`flex items-center gap-3 px-4 py-3 rounded ${
            breadcrumbs.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#4f5559]"
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setShowCreateFolder(true)}
          className="bg-[#4a9d5b] px-5 py-3 rounded cursor-pointer hover:bg-[#3d8c4d] flex items-center gap-3"
        >
          <Plus className="w-6 h-6" />
          New Folder
        </button>

        <label
          className={`bg-[#5a8dee] px-5 py-3 rounded cursor-pointer hover:bg-[#4a7dde] flex items-center gap-3 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <File className="w-6 h-6" />
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

        <label
          className={`bg-[#5a8dee] px-5 py-3 rounded cursor-pointer hover:bg-[#4a7dde] flex items-center gap-3 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <FolderUp className="w-6 h-6" />
          Upload Folder
          <input
            ref={folderInputRef}
            type="file"
            multiple
            // @ts-ignore: webkitdirectory is non-standard
            webkitdirectory=""
            // @ts-ignore: directory is non-standard
            directory=""
            hidden
            onChange={handleFolderUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-[#2f3439] text-gray-200 text-lg p-5">
          <div className="font-semibold mb-4 text-xl">Media</div>
          <div
            className={`pl-4 py-3 cursor-pointer rounded flex items-center gap-3 ${
              currentFolderId === null ? "bg-[#4b5563]" : ""
            }`}
            onClick={() => {
              setBreadcrumbs([]);
              setCurrentFolderId(null);
            }}
          >
            <Folder className="w-6 h-6" />
            Root
          </div>
        </div>

        {/* File Table */}
        <div className="flex-1 bg-[#e5e7eb] overflow-auto">
          {/* Breadcrumb */}
          <div className="px-4 py-3 text-lg bg-[#d1d5db] flex items-center gap-3">
            <span
              className="cursor-pointer text-brand-500 font-medium"
              onClick={() => navigateToBreadcrumb(-1)}
            >
              Root
            </span>
            {breadcrumbs.map((folder, index) => (
              <span key={folder.id} className="flex items-center gap-2">
                /
                <span
                  className="cursor-pointer text-brand-500 font-medium"
                  onClick={() => navigateToBreadcrumb(index)}
                >
                  {folder.name}
                </span>
              </span>
            ))}
          </div>

          {/* Header */}
          <div className="grid grid-cols-[3fr_2fr_1fr_1fr_2fr] bg-[#374151] text-white text-base font-semibold px-4 py-4">
            <div>Name</div>
            <div>Modified</div>
            <div>Size</div>
            <div>Type</div>
            <div>Actions</div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>No files or folders</p>
            </div>
          ) : (
            /* Rows */
            items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[3fr_2fr_1fr_1fr_2fr] px-4 py-3 text-lg border-b hover:bg-[#d1d5db]"
              >
                <div
                  className={`flex items-center gap-3 ${
                    item.type === "folder"
                      ? "cursor-pointer text-brand-500"
                      : ""
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
                        className="px-2 py-1 border rounded text-sm"
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
                        className="text-green-600 hover:text-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setRenamingItem(null);
                          setRenameValue("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>

                <div>{formatDate(item.updatedAt)}</div>
                <div>
                  {item.type === "folder" ? "—" : formatSize(item.size)}
                </div>
                <div>{item.type === "folder" ? "Folder" : "File"}</div>
                <div className="flex items-center gap-3">
                  {item.type === "file" && (
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRenamingItem(item);
                      setRenameValue(item.name);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    title="Rename"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-[#374151] text-base text-white flex justify-between">
        <span>Items: {items.length}</span>
        <span>
          Status:{" "}
          {loading ? "Loading..." : uploading ? "Uploading..." : "Ready"}
        </span>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Folder</h3>
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border rounded-md mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={creatingFolder}
                className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50"
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
