import React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex justify-between items-center px-5 py-3 bg-white/80 backdrop-blur-md border-b border-border shadow-soft">
      {/* ✅ 왼쪽 로고 */}
      <a href="/" className="flex items-center gap-2">
        <img
          src="/image.png" // 임시 로고
          alt="StampPaw Logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-2xl font-bold text-primary">StampPaw</h1>
      </a>

      {/* ✅ 오른쪽 검색 버튼 */}
      <button
        onClick={() => navigate("/search")}
        className="text-muted hover:text-primary transition"
      >
        <Search className="w-6 h-6" />
      </button>
    </header>
  );
}
