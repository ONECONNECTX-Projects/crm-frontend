"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import Toast, { ToastType } from "@/app/common/Toast";
import { setGlobalErrorHandler, ApiError } from "@/app/utils/apiClient";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ErrorContextType {
  showToast: (message: string, type?: ToastType) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const showError = useCallback((message: string) => {
    showToast(message, "error");
  }, [showToast]);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success");
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast(message, "warning");
  }, [showToast]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Set up global error handler for API errors
  useEffect(() => {
    setGlobalErrorHandler((error: ApiError) => {
      showError(error.message);
    });
  }, [showError]);

  return (
    <ErrorContext.Provider value={{ showToast, showError, showSuccess, showWarning }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within ErrorProvider");
  }
  return context;
}