import React, { useState, useMemo } from "react";
import SearchBar from "../../components/ui/SearchBar";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function SearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  // 섹션별 검색 결과
  const [companions, setCompanions] = useState([]);
  const [walks, setWalks] = useState([]);
  const [products, setProducts] = useState([]);
  const [parttimes, setParttimes] = useState([]);

  // 토큰 최초 렌더 캐싱
  const token = useMemo(() => localStorage.getItem("token"), []);

  const BASE = import.meta.env.VITE_API_BASE_URL;

  // 검색
  const handleSearch = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setCompanions([]);
      setParttimes([]);
      setWalks([]);
      setProducts([]);
      return;
    }

    try {
      // 동행 / 알바 / 산책글 동시 검색 (promise.all)
      const [cRes, pRes, wRes] = await Promise.all([
        // 🟡 동행글
        fetch(
          `${BASE}/companion/search?title=${encodeURIComponent(value)}&page=0&size=3`
        ).then((r) => (r.ok ? r.json() : null)),

        // 🟠 알바글
        fetch(
          `${BASE}/parttime/search?title=${encodeURIComponent(value)}&page=0&size=3`
        ).then((r) => (r.ok ? r.json() : null)),

        // 🔵 산책글 (axios 사용)
        api
          .get("/walks/search", {
            params: { memo: value, page: 0, size: 3 },
          })
          .then((r) => r.data)
          .catch(() => null),
      ]);

      // 🟡 동행
      setCompanions(cRes?.content || []);

      // 🟠 알바
      setParttimes(pRes?.content || []);

      // 🔵 산책글
      setWalks(wRes?.content || []);
    } catch (err) {
      console.error("검색 오류:", err);
    }
  };

  // 카드 렌더링
  const renderCard = (item, type) => {
    const thumb = item.image || "/walk/walk-thumbnail.png";

    return (
      <div
        key={item.id}
        onClick={() => {
          if (type === "companion") navigate(`/companion/${item.id}`);
          if (type === "parttime") navigate(`/parttime/${item.id}`);
          if (type === "walk") navigate(`/walk/${item.id}`);
          if (type === "market") navigate(`/market/${item.id}`);
        }}
        className="bg-white rounded-xl shadow-soft overflow-hidden 
                 border border-border cursor-pointer 
                 hover:shadow-md transition-all w-40"
      >
        <img src={thumb} alt={item.title} className="w-full h-32 object-cover" />

        <div className="p-2">
          <p className="font-semibold text-sm text-text line-clamp-2">
            {item.title || "제목 없음"}
          </p>

          {type !== "walk" && item.content && (
            <p className="text-muted text-xs mt-1 line-clamp-2">
              {item.content}
            </p>
          )}

          {type === "walk" && item.startTime && (
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
      <h1 className="text-2xl font-bold mb-6 text-primary">검색</h1>

      <SearchBar onChange={handleSearch} />

      <Section
        title="동행"
        items={companions}
        onMore={() =>
          navigate(`/search/companion?query=${encodeURIComponent(query)}`)
        }
        render={(i) => renderCard(i, "companion")}
      />

      <Section
        title="알바"
        items={parttimes}
        onMore={() =>
          navigate(`/search/parttime?query=${encodeURIComponent(query)}`)
        }
        render={(i) => renderCard(i, "parttime")}
      />

      <Section
        title="산책글"
        items={walks}
        onMore={() =>
          navigate(`/search/walks?query=${encodeURIComponent(query)}`)
        }
        render={(i) => renderCard(i, "walk")}
      />

      <Section
        title="마켓"
        items={products}
        onMore={() => {}}
        render={(i) => renderCard(i, "market")}
      />
    </div>
  );
}

/* 공통 컴포넌트 */
function Section({ title, items, onMore, render }) {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">{title}</h2>
        <button className="text-primary text-sm" onClick={onMore}>
          더보기
        </button>
      </div>

      <div className="flex gap-3">{items.map(render)}</div>

      <hr className="my-6 border-gray-200" />
    </div>
  );
}
