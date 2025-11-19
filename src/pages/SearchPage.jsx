import React from "react";
import SearchBar from "../components/ui/SearchBar";

export default function SearchPage() {
  return (
    <div className="px-5 py-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">검색</h1>

      {/* 검색 바 */}
      <SearchBar />

      {/* 추후 검색 결과 영역 */}
      <div className="mt-6 text-gray-500">
        검색어를 입력하면 결과가 표시됩니다.
      </div>
    </div>
  );
}
