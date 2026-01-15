"use client";

import { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "error":
        return <FiXCircle className="text-red-500" size={20} />;
      case "warning":
        return <FiAlertCircle className="text-yellow-500" size={20} />;
      default:
        return <FiAlertCircle className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg border ${getBgColor()} shadow-lg animate-slide-in-right max-w-md`}
    >
      {getIcon()}
      <p className="flex-1 text-sm text-gray-800">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiX size={18} />
      </button>
    </div>
  );
}