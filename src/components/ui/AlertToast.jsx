import React, { useEffect } from "react";

export default function AlertToast({
  message,
  onClose,
  auto = true,
  duration = 2000,
}) {
  useEffect(() => {
    if (!message) return;
    if (!auto) return; // auto=false이면 setTimeout 안함

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, auto, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-[100] pointer-events-none">
      <div className="mt-24 bg-secondary text-text px-6 py-3 rounded-xl shadow-lg font-medium text-center animate-fadeIn">
        {message}
      </div>
    </div>
  );
}
