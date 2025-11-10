// src/components/ui/AlertToast.jsx
import React, { useEffect } from "react";

export default function AlertToast({ message, onClose, duration = 2000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
      <div className="bg-secondary text-text px-6 py-3 rounded-xl shadow-lg font-medium text-center animate-fadeIn">
        {message}
      </div>
    </div>
  );
}
