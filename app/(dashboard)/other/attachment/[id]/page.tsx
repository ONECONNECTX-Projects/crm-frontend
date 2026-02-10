"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Trash2,
  FileIcon,
  FileText,
  FileImage,
  FileSpreadsheet,
  Calendar,
  User,
  Building2,
  Contact,
  Target,
  FileCheck,
  X,
  ZoomIn,
} from "lucide-react";
import {
  Attachment,
  getAttachmentById,
  deleteAttachment,
} from "@/app/services/attachment/attachement.service";
import { useError } from "@/app/providers/ErrorProvider";

export default function AttachmentViewPage() {
  const router = useRouter();
  const params = useParams();
  const { showSuccess, showError } = useError();

  const attachmentId = Number(params.id);

  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    if (!attachmentId) return;

    const fetchAttachment = async () => {
      try {
        setLoading(true);
        const res = await getAttachmentById(attachmentId);
        setAttachment(res.data || null);
      } catch (error) {
        console.error("Failed to fetch attachment:", error);
        showError("Failed to fetch attachment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAttachment();
  }, [attachmentId, showError]);

  const handleDelete = async () => {
    if (!attachment) return;

    if (
      window.confirm(
        `Are you sure you want to delete "${attachment.file_name}"?`,
      )
    ) {
      setDeleting(true);
      try {
        await deleteAttachment(attachment.id);
        showSuccess("Attachment deleted successfully");
        router.push("/other/attachment");
      } catch (error) {
        console.error("Failed to delete attachment:", error);
        showError("Failed to delete attachment");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDownload = () => {
    if (attachment?.file_url) {
      // Create a temporary anchor to trigger download
      const link = document.createElement("a");
      link.href = attachment.file_url;
      link.download = attachment.file_name || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImageFile = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    return (
      type.includes("image") ||
      type.includes("png") ||
      type.includes("jpg") ||
      type.includes("jpeg") ||
      type.includes("gif") ||
      type.includes("webp") ||
      type.includes("svg")
    );
  };

  const isPdfFile = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    return type.includes("pdf");
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    if (isImageFile(type)) {
      return <FileImage className="w-12 h-12 text-brand-500" />;
    } else if (type.includes("pdf")) {
      return <FileText className="w-12 h-12 text-red-500" />;
    } else if (
      type.includes("sheet") ||
      type.includes("excel") ||
      type.includes("xls")
    ) {
      return <FileSpreadsheet className="w-12 h-12 text-green-500" />;
    } else if (type.includes("doc") || type.includes("word")) {
      return <FileText className="w-12 h-12 text-brand-500" />;
    }
    return <FileIcon className="w-12 h-12 text-gray-500" />;
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading attachment...</p>
        </div>
      </div>
    );
  }

  if (!attachment) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <FileIcon className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 text-lg">Attachment not found</p>
        <button
          onClick={() => router.push("/other/attachment")}
          className="text-brand-500 hover:text-brand-600 font-medium"
        >
          Go back to attachments
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Attachment Details
            </h1>
            <p className="text-sm text-gray-500">View and manage attachment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Preview Card */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <div className="flex flex-col items-center text-center">
                {/* File Preview/Icon */}
                {isImageFile(attachment.file_type) ? (
                  <div
                    className="relative w-full mb-4 cursor-pointer group"
                    onClick={() => setShowFullPreview(true)}
                  >
                    <img
                      src={attachment.file_url}
                      alt={attachment.file_name}
                      className="w-full h-48 object-contain rounded-xl border border-gray-200 bg-white"
                      onError={(e) => {
                        // If image fails to load, show icon instead
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden",
                        );
                      }}
                    />
                    <div className="hidden w-full h-48 bg-white rounded-xl border border-gray-200 items-center justify-center">
                      <FileImage className="w-16 h-16 text-gray-400" />
                    </div>
                    {/* Zoom overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                    {getFileIcon(attachment.file_type)}
                  </div>
                )}

                {/* File Name */}
                <h3 className="font-semibold text-gray-900 mb-1 break-all">
                  {attachment.file_name}
                </h3>

                {/* File Type */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-600 mb-3">
                  {attachment.file_type || "Unknown type"}
                </span>

                {/* Quick Actions */}
                <div className="flex gap-3 mt-2">
                  {isImageFile(attachment.file_type) && (
                    <button
                      onClick={() => setShowFullPreview(true)}
                      className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
                    >
                      <ZoomIn className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-4 border border-gray-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Dates
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(attachment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(attachment.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Preview (Large) for images */}
            {isImageFile(attachment.file_type) && (
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setShowFullPreview(true)}
                >
                  <img
                    src={attachment.file_url}
                    alt={attachment.file_name}
                    className="w-full max-h-[400px] object-contain rounded-lg border border-gray-200 bg-gray-50"
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2">
                      <ZoomIn className="w-5 h-5 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">
                        Click to view full size
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PDF Preview */}
            {isPdfFile(attachment.file_type) && (
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                <iframe
                  src={attachment.file_url}
                  className="w-full h-[500px] rounded-lg border border-gray-200"
                  title={attachment.file_name}
                />
              </div>
            )}

            {/* Related Information */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Related Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-50 rounded-lg">
                    <User className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-medium text-gray-900">
                      {attachment.owner?.name || "-"}
                    </p>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent-brand-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-accent-brand-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">
                      {attachment.company?.name || "-"}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Contact className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium text-gray-900">
                      {attachment.contact?.name || "-"}
                    </p>
                  </div>
                </div>

                {/* Opportunity */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Target className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Opportunity</p>
                    <p className="font-medium text-gray-900">
                      {attachment.opportunity?.name || "-"}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <FileCheck className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quote</p>
                    <p className="font-medium text-gray-900">
                      {attachment.quote?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Details */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">File Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">File Name</p>
                  <p className="font-medium text-gray-900 break-all">
                    {attachment.file_name}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">File Type</p>
                  <p className="font-medium text-gray-900">
                    {attachment.file_type || "Unknown"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      attachment.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {attachment.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Attachment ID</p>
                  <p className="font-medium text-gray-900">#{attachment.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Preview Modal */}
      {showFullPreview && isImageFile(attachment.file_type) && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setShowFullPreview(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowFullPreview(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <img
              src={attachment.file_url}
              alt={attachment.file_name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {/* File Name & Download */}
            <div className="absolute -bottom-14 left-0 right-0 flex items-center justify-between text-white px-4">
              <span className="text-sm truncate max-w-[50%]">
                {attachment.file_name}
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
