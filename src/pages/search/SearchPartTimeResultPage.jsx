import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import UserAvatar from "@/components/ui/UserAvatar";
import { ArrowLeft } from "lucide-react";

export default function SearchPartTimeResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useState(0);
  const size = 10;

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/parttime/search?title=${encodeURIComponent(
          query
        )}&page=${page}&size=${size}`
      );

      if (res.ok) {
        const data = await res.json();
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
      }
    } catch (err) {
      console.error("파트타임 검색 오류:", err);
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

  return (
    <div className="px-5 py-6">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <ArrowLeft className="text-gray-700" size={22} />
      </button>

      <h1 className="text-xl font-bold mb-6 text-primary">
        "{query}" 검색 결과
      </h1>

      <div className="flex flex-col gap-4">
        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/parttime/${item.id}`)}
            className="bg-white p-0 border border-gray-200 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 group overflow-hidden"
          >
            <div className="w-full h-40 bg-gray-100 overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="p-5">
              <h2 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition">
                {item.title}
              </h2>

              <p className="text-gray-600 mt-2 leading-relaxed text-sm line-clamp-2">
                {item.content}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <UserAvatar
                  image={item.user?.image}
                  alt={item.user?.nickname || "user"}
                  size="sm"
                />
                <span className="text-sm text-gray-700 font-medium">
                  {item.user?.nickname || "알수없는 사용자"}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
                <span>상세보기</span>
                <span>›</span>
              </div>
            </div>
          </div>
        ))}
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
