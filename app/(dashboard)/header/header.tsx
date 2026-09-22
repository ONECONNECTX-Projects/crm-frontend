"use client";

import { useState, useEffect } from "react";
import { LogOut, Maximize, Minimize } from "lucide-react";
import { FiMenu } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import CommonButton from "@/app/common/button";
import {
  getAllProfiles,
  Profile,
} from "@/app/services/profile/profile.service";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({
  onMenuClick,
  showMenuButton = false,
}: HeaderProps) {
  const [isFull, setIsFull] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Page title from the URL — last segment that isn't a record id, "lead-source" -> "Lead Source".
  const pageTitle =
    pathname
      .split("/")
      .filter((s) => s && !/^\d+$/.test(s) && !/^[0-9a-f]{8,}/i.test(s))
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";

  // FULLSCREEN TOGGLE
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFull(true);
    } else {
      document.exitFullscreen();
      setIsFull(false);
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await getAllProfiles();
      setProfile(response.user);
    } catch (error) {
      console.error("Failed to fetch Profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Avatar initials — first letter of the first two words, "QC" until the profile lands.
  const initials =
    profile.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "QC";

  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-info");
    setConfirmLogout(false);
    router.push("/login");
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/60 bg-white/70 px-4 backdrop-blur-xl sm:px-6">
        {/* LEFT - Mobile Menu Button */}
        <div className="flex items-center">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="-ml-1 rounded-lg p-2 text-brand-700 transition-colors hover:bg-muted"
              aria-label="Open menu"
            >
              <FiMenu className="text-xl" />
            </button>
          )}
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* FULL SCREEN */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFull ? "Exit fullscreen" : "Enter fullscreen"}
            className="rounded-lg p-2 text-brand-700 transition-colors hover:bg-muted"
          >
            {isFull ? (
              <Minimize className="size-5" />
            ) : (
              <Maximize className="size-5" />
            )}
          </button>

          {/* USER */}
          <div className="flex items-center gap-2 p-1.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-md shadow-brand-500/30 ring-1 ring-white/40">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight text-foreground">
                {profile.name || "—"}
              </span>
              <span className="block text-xs leading-tight text-muted-foreground">
                {profile.email || ""}
              </span>
            </span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => setConfirmLogout(true)}
            aria-label="Logout"
            title="Logout"
            className="rounded-lg bg-brand-500 p-1.5 text-white transition-colors hover:bg-brand-600"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* CONFIRM LOGOUT POPUP */}
      {confirmLogout && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-brand-900/40 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-[320px] rounded-2xl p-5 sm:max-w-sm sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Confirm Logout
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to log out?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="rounded-lg bg-white/60 px-4 py-2 text-foreground ring-1 ring-white/60 transition-colors hover:bg-white/90"
              >
                No
              </button>

              <CommonButton
                label="Yes, Logout"
                onClick={handleLogout}
                className="py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              ></CommonButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
