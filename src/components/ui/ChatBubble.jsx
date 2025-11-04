import React from "react";

export default function ChatBubble() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Chat Bubbles</h2>
      <div className="flex flex-col gap-3 w-full">
        <div className="self-start bg-input text-text px-4 py-2 rounded-2xl shadow-soft max-w-[75%]">
          안녕하세요!
        </div>
        <div className="self-end bg-primary text-white px-4 py-2 rounded-2xl shadow-soft max-w-[75%]">
          네! 반갑습니다 🐾
        </div>
      </div>
    </section>
  );
}
