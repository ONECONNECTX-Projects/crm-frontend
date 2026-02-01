"use client";

import { useEffect, useState } from "react";
import Sidebar from "./sidebar/sidebar";
import { FiChevronLeft, FiChevronRight, FiMenu, FiX } from "react-icons/fi";
import Header from "./header/header";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function DashboardLayout({ children }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setMobileOpen(false);
      } else if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* LEFT - SIDEBAR */}
      <div className={`
        ${isMobile
          ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'relative h-screen'
        }
      `}>

        {/* TOGGLE BUTTON - Desktop Only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 w-8 h-8 rounded-full bg-white text-gray-500 shadow-lg
              flex items-center justify-center z-50 border"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        )}

        {/* MOBILE CLOSE BUTTON */}
        {isMobile && mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-2 top-2 w-8 h-8 rounded-full bg-gray-100 text-gray-600
              flex items-center justify-center z-50"
          >
            <FiX />
          </button>
        )}

        {/* SIDEBAR SCROLLING CONTAINER */}
        <div className="h-full overflow-y-auto">
          <Sidebar collapsed={isMobile ? false : collapsed} onNavigate={closeMobileSidebar} />
        </div>
      </div>

      {/* RIGHT - PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col h-screen">
          <Header
            onMenuClick={() => setMobileOpen(true)}
            showMenuButton={isMobile}
          />

          <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
