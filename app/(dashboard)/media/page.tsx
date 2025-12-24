"use client";

import { useState } from "react";
import { ArrowLeft, Upload, FolderUp, File } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "file" | "folder";
  file?: File;
  parent: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [currentPath, setCurrentPath] = useState("root");

  const currentItems = items.filter((i) => i.parent === currentPath);

  // Handle file upload (individual files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: MediaItem[] = [];

    Array.from(files).forEach((file) => {
      newItems.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: "file",
        file,
        parent: currentPath,
      });
    });

    setItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  // Handle folder upload (entire folder with hierarchy)
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: MediaItem[] = [];

    Array.from(files).forEach((file) => {
      const relativePath = (file as any).webkitRelativePath || file.name;
      const parts = relativePath.split("/");
      let parent = currentPath;

      // Create folder hierarchy
      parts.slice(0, -1).forEach((folder: any) => {
        const exists =
          newItems.find((i) => i.name === folder && i.parent === parent) ||
          items.find((i) => i.name === folder && i.parent === parent);

        if (!exists) {
          const id = crypto.randomUUID();
          newItems.push({
            id,
            name: folder,
            type: "folder",
            parent,
          });
          parent = id;
        } else {
          parent = exists.id;
        }
      });

      // Add the file itself
      newItems.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: "file",
        file,
        parent,
      });
    });

    setItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper for breadcrumb navigation
  const getPath = (id: string): MediaItem[] => {
    const path: MediaItem[] = [];
    let current = items.find((i) => i.id === id);
    while (current && current.parent !== "root") {
      path.unshift(current);
      current = items.find((i) => i.id === current?.parent);
    }
    return path;
  };

  // Navigate to parent folder
  const handleGoBack = () => {
    if (currentPath === "root") return;

    const currentItem = items.find((i) => i.id === currentPath);
    if (currentItem) {
      setCurrentPath(currentItem.parent);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#d1d5db]">
      {/* Top Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#3f454a] text-white text-sm">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          disabled={currentPath === "root"}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            currentPath === "root"
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#4f5559] cursor-pointer"
          }`}
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        {/* Upload File Button */}
        <label className="bg-[#5a8dee] px-3 py-1 rounded cursor-pointer hover:bg-[#4a7dde] flex items-center gap-2">
          <File className="w-4 h-4" />
          Upload Files
          <input type="file" multiple hidden onChange={handleFileUpload} />
        </label>

        {/* Upload Folder Button */}
        <label className="bg-[#5a8dee] px-3 py-1 rounded cursor-pointer hover:bg-[#4a7dde] flex items-center gap-2">
          <FolderUp className="w-4 h-4" />
          Upload Folder
          <input
            type="file"
            multiple
            // @ts-ignore: webkitdirectory is non-standard
            webkitdirectory=""
            // @ts-ignore: directory is non-standard
            directory=""
            hidden
            onChange={handleFolderUpload}
          />
        </label>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-[#2f3439] text-gray-200 text-sm p-3">
          <div className="font-semibold mb-2">media</div>

          <div
            className={`pl-3 py-1 cursor-pointer rounded ${
              currentPath === "root" ? "bg-[#4b5563]" : ""
            }`}
            onClick={() => setCurrentPath("root")}
          >
            📁 public
          </div>
        </div>

        {/* File Table */}
        <div className="flex-1 bg-[#e5e7eb] overflow-auto">
          {/* Breadcrumb */}
          <div className="px-2 py-1 text-sm bg-[#d1d5db] flex items-center gap-2">
            <span
              className="cursor-pointer text-blue-600"
              onClick={() => setCurrentPath("root")}
            >
              public
            </span>
            {currentPath !== "root" &&
              getPath(currentPath).map((folder) => (
                <span key={folder.id} className="flex items-center gap-1">
                  <span> / </span>
                  <span
                    className="cursor-pointer text-blue-600"
                    onClick={() => setCurrentPath(folder.id)}
                  >
                    {folder.name}
                  </span>
                </span>
              ))}
          </div>

          {/* Header */}
          <div className="grid grid-cols-[3fr_2fr_2fr_1fr_2fr] bg-[#374151] text-white text-xs font-semibold px-2 py-2">
            <div>Name</div>
            <div>Permissions</div>
            <div>Modified</div>
            <div>Size</div>
            <div>Kind</div>
          </div>

          {/* Rows */}
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[3fr_2fr_2fr_1fr_2fr] px-2 py-1 text-sm border-b hover:bg-[#d1d5db]"
            >
              <div
                className={`flex items-center gap-2 ${
                  item.type === "folder" ? "cursor-pointer text-blue-700" : ""
                }`}
                onDoubleClick={() =>
                  item.type === "folder" && setCurrentPath(item.id)
                }
              >
                {item.type === "folder" ? "📁" : "🖼"} {item.name}
              </div>

              <div>read and write</div>
              <div>—</div>
              <div>{item.type === "file" ? "—" : ""}</div>
              <div className="flex items-center gap-2">
                {item.type === "file" ? "File" : "Folder"}
                {item.type === "file" && item.file && (
                  <button
                    className="text-green-700 ml-2"
                    onClick={() => downloadFile(item.file!)}
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-1 bg-[#374151] text-xs text-white flex justify-between">
        <span>Items: {currentItems.length}</span>
        <span>Status: Ready</span>
      </div>
    </div>
  );
}
