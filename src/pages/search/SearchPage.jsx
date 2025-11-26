import React, { useState } from "react";
import SearchBar from "../../components/ui/SearchBar";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  // 섹션별 검색 결과
  const [companions, setCompanions] = useState([]);
  const [walks, setWalks] = useState([]);
  const [products, setProducts] = useState([]);
  const [parttimes, setParttimes] = useState([]);


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
      // 🟡 동행글
      const res1 = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/companion/search?title=${encodeURIComponent(value)}&page=0&size=3`
      );

      if (res1.ok) {
        const data1 = await res1.json();
        setCompanions(data1.content || []);
      }

      // 🟠 알바글
      const resPT = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/parttime/search?title=${encodeURIComponent(value)}&page=0&size=3`
      );

      if (resPT.ok) {
        const dataPT = await resPT.json();
        setParttimes(dataPT.content || []);
      }

      // 🔵 산책글 — API 준비되면 URL 교체!
      //   const res2 = await fetch(
      //     `${
      //       import.meta.env.VITE_API_BASE_URL
      //     }/walks/search?title=${encodeURIComponent(value)}&page=0&size=3`
      //   );

      //   if (res2.ok) {
      //     const data2 = await res2.json();
      //     setWalks(data2.content || []);
      //   }

      //   // 🟢 마켓 — API 준비되면 URL 교체!
      //   const res3 = await fetch(
      //     `${
      //       import.meta.env.VITE_API_BASE_URL
      //     }/market/search?title=${encodeURIComponent(value)}&page=0&size=3`
      //   );

      //   if (res3.ok) {
      //     const data3 = await res3.json();
      //     setProducts(data3.content || []);
      //   }
    } catch (e) {
      console.error("검색 오류:", e);
    }
  };

  const renderCard = (item, type) => (
    <div
      key={item.id}
      onClick={() => {
        if (type === "companion") navigate(`/companion/${item.id}`);
        if (type === "parttime") navigate(`/parttime/${item.id}`);
        if (type === "walk") navigate(`/walks/${item.id}`);
        if (type === "market") navigate(`/market/${item.id}`);
      }}
      className="w-40 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border hover:shadow-lg transition"
    >
      <div className="h-24 w-full bg-gray-200 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {item.content}
        </p>
      </div>
    </div>
  );

  return (
    <div className="px-5 py-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">검색</h1>

      <SearchBar onChange={handleSearch} />

      {/* ----------------------------- */}
      {/* 섹션 1 - 동행 */}
      {/* ----------------------------- */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">동행</h2>
          <button
            className="text-primary text-sm"
            onClick={() =>
              navigate(`/search/companion?query=${encodeURIComponent(query)}`)
            }
          >
            더보기
          </button>
        </div>

        <div className="flex gap-3">
          {companions.map((item) => renderCard(item, "companion"))}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* ----------------------------- */}
      {/* 섹션 2 - 알바 */}
      {/* ----------------------------- */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">알바</h2>
          <button
            className="text-primary text-sm"
            onClick={() =>
              navigate(`/search/parttime?query=${encodeURIComponent(query)}`)
            }
          >
            더보기
          </button>
        </div>

        <div className="flex gap-3">
          {parttimes.map((item) => renderCard(item, "parttime"))}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />


      {/* ----------------------------- */}
      {/* 섹션 3 - 산책글 */}
      {/* ----------------------------- */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">산책글</h2>
          <button className="text-primary text-sm">더보기</button>
        </div>

        <div className="flex gap-3">
          {walks.map((item) => renderCard(item, "walk"))}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* ----------------------------- */}
      {/* 섹션 4 - 마켓 */}
      {/* ----------------------------- */}
      <div className="mt-6 mb-16">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">마켓</h2>
          <button className="text-primary text-sm">더보기</button>
        </div>

        <div className="flex gap-3">
          {products.map((item) => renderCard(item, "market"))}
        </div>
      </div>
    </div>
  );
}
