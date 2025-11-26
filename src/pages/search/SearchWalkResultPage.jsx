import api from "../../services/api";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SearchWalkResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useState(0);
  const size = 10;

const fetchData = async () => {
  try {
    const res = await api.get("/walks/search", {
      params: {
        memo: query,
        page,
        size,
      },
    });

    console.log("API 응답:", res);

    const data = res.data;

    const newItems = data.content || [];

    if (newItems.length === 0) {
      setHasNext(false);
      return;
    }

    setResults((prev) => {
      const ids = new Set(prev.map((item) => item.id));
      const filtered = newItems.filter((item) => !ids.has(item.id));
      return [...prev, ...filtered];
    });

  } catch (err) {
    console.error("산책 검색 오류:", err);
  }
};

  useEffect(() => {
    setResults([]);
    setPage(0);
    setHasNext(true);
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [page]);

  const renderCard = (item) => {
    const thumb = item.image || "/walk/walk-thumbnail.png";

    return (
      <div
        key={item.id}
        onClick={() => navigate(`/walk/${item.id}`)}
        className="bg-white rounded-xl shadow-soft overflow-hidden 
                   border border-border cursor-pointer 
                   hover:shadow-md transition-all w-40"
      >
        {/* 썸네일 */}
        <img
          src={thumb}
          alt={item.title || "산책 메모"}
          className="w-full h-32 object-cover"
        />

        <div className="p-2">
          {/* 제목 = 메모 또는 '메모 없음' */}
          <p className="font-semibold text-sm text-text line-clamp-2">
            {item.title?.trim() || "메모 없음"}
          </p>

          {/* 날짜 */}
          {item.startTime && (
            <p className="text-muted text-xs mt-1">
              {new Date(item.startTime).toLocaleDateString()}{" "}
              {new Date(item.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="px-5 py-6">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <ArrowLeft className="text-gray-700" size={22} />
      </button>

      <h1 className="text-xl font-bold mb-6 text-primary">
        "{query}" 산책 검색 결과
      </h1>

      <div className="flex flex-wrap gap-4">
        {results.map((item) => renderCard(item))}
      </div>

      {hasNext ? (
        <button
          className="w-full py-3 mt-6 bg-primary text-white rounded-xl font-semibold"
          onClick={() => setPage((prev) => prev + 1)}
        >
          더 불러오기
        </button>
      ) : (
        <div className="w-full py-3 mt-6 text-center text-gray-500">
          더 이상 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}
