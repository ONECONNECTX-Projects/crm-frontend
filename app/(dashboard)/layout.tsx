"use client";

import { useEffect, useState } from "react";
import Sidebar from "./sidebar/sidebar";
import { FiMenu, FiX } from "react-icons/fi";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
    <div className="flex min-h-screen">

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 scale-110 bg-cover bg-center bg-no-repeat blur-sm"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-white/70" />

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
            className="glass-strong absolute -right-3 top-3.5 z-50 flex h-8 w-8 items-center
              justify-center rounded-md text-slate-500 transition-colors hover:text-brand-700"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-6" />
            ) : (
              <PanelLeftClose className="size-6" />
            )}
          </button>
        )}

        {/* MOBILE CLOSE BUTTON */}
        {isMobile && mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-2 top-3 z-50 flex h-8 w-8 items-center justify-center
              rounded-full bg-brand-50 text-brand-700 shadow-sm"
          >
            <FiX />
          </button>
        )}

        {/* SIDEBAR SCROLLING CONTAINER */}
        <div className="h-full">
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

          <div className="p-2 sm:p-3 md:p-4 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
