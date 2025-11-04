import React from "react";

export default function ChatPreview() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Chat Preview</h2>
      <div className="bg-white rounded-xl shadow-soft p-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-full" />
          <div>
            <h3 className="font-semibold">Nathan Scott</h3>
            <p className="text-sm text-muted">오늘 산책 괜찮으셨나요?</p>
          </div>
        </div>
      </div>
    </section>
  );
}
