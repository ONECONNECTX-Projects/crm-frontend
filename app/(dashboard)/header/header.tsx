"use client";

import { useState, useRef, useEffect } from "react";
import { LuUser } from "react-icons/lu";
import {
  RxEnterFullScreen,
  RxExitFullScreen,
} from "react-icons/rx";
import { useRouter } from "next/navigation";
import CommonButton from "@/app/common/button";

export default function Header() {
  const [isFull, setIsFull] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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

  // CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // LOGOUT HANDLER
  const handleLogout = () => {
    setConfirmLogout(false);
    router.push("/login");
  };

  return (
    <>
      {/* HEADER */}
      <header className="w-full h-16 bg-white border-b flex items-center justify-between px-4 relative">
        <div></div>

        <div className="flex items-center text-black gap-6">
          {/* FULL SCREEN */}
          <button onClick={toggleFullscreen}>
            {isFull ? (
              <RxExitFullScreen className="text-xl cursor-pointer" />
            ) : (
              <RxEnterFullScreen className="text-xl cursor-pointer" />
            )}
          </button>

          {/* USER MENU */}
          <div className="relative" ref={menuRef}>
            <LuUser
              className="text-xl cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            />

            {openMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg py-1 animate-fadeIn z-50">
                <div className="px-4 py-2 flex items-center gap-3 text-gray-800 hover:bg-gray-50 cursor-pointer">
                  <LuUser className="text-lg" />
                  <span className="font-medium">MR. STAFF</span>
                </div>

                <button
                  className="w-full text-left px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50"
                  onClick={() => setConfirmLogout(true)}
                >
                  <span className="text-lg">↻</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONFIRM LOGOUT POPUP */}
      {confirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setConfirmLogout(false)}
                className="px-4 py-2 rounded-md text-black bg-gray-200 hover:bg-gray-300"
              >
                No
              </button>

              <CommonButton
              label="Yes, Logout"

                onClick={handleLogout}
                className="py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >

              </CommonButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
