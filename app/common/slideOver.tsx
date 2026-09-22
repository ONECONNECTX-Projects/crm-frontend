"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function SlideOver({ open, onClose, children, width = "sm:w-[50vw]" }: SlideOverProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-brand-900/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/*
            Slide-over panel. No padding here on purpose: the forms rendered
            inside supply their own header / scroll body / footer, so padding
            here shows up as a dead frame around the real panel.
          */}
          <motion.div
            className={`fixed right-0 top-0 z-50 h-full w-full ${width} overflow-y-auto bg-white shadow-2xl shadow-brand-900/20`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 24 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
