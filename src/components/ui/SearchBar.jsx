import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onChange }) {
  return (
    <section>
      <div className="flex items-center gap-3 w-full bg-white rounded-xl px-5 py-3 border border-border focus-within:ring-2 focus-within:ring-primary transition-all">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          onChange={(e) => onChange && onChange(e.target.value)}
        />
        <Search className="w-5 h-5 text-primary shrink-0" strokeWidth={2.2} />
      </div>
    </section>
  );
}
