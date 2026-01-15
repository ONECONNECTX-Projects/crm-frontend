"use client";

import { useEffect, useState } from "react";
import Sidebar from "./sidebar/sidebar";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Header from "./header/header";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function DashboardLayout({ children }: any) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* LEFT - SIDEBAR */}
      <div className="relative h-screen ">
        
        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-8 h-8 rounded-full bg-white text-gray-500 shadow-lg 
            flex items-center justify-center z-50 border"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>

        {/* SIDEBAR SCROLLING CONTAINER */}
        <div className="h-full overflow-y-auto">
          <Sidebar collapsed={collapsed} />
        </div>
      </div>

      {/* RIGHT - PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col h-screen">
          <Header />

          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
