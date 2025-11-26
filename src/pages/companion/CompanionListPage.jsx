import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import Tag from "../../components/ui/Tag";

import { getAllCompanions } from "../../services/companionService";
import CompanionCard from "./CompanionCard";

export default function CompanionListPage() {
  const [companions, setCompanions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("동행 모집");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 페이지 진입 시 탭 초기화
  useEffect(() => {
    setSelectedTag("동행 모집");
  }, []);

  // 🔥 탭 변경 시 데이터 초기화
  useEffect(() => {
    setCompanions([]);
    setPage(0);
  }, [selectedTag]);

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const data = await getAllCompanions(page, 10);
        setCompanions((prev) => {
          const merged = [...prev, ...data.content];
          return merged.filter(
            (item, index, self) =>
              index === self.findIndex((p) => p.id === item.id)
          );
        });
        setHasMore(!data.last);
      } catch (error) {
        console.error("동행 모집글 불러오기 실패:", error);
      }
    };
    fetchCompanions();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const handleTagClick = (tag) => {
    if (tag === "전체") {
      navigate("/");
    } else if (tag === "자유") {
      navigate("/community");
    } else if (tag === "알바 구인") {
      navigate("/parttime");
    } else {
      // 동행 모집
      navigate("/companion");
    }

    setSelectedTag(tag);
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-[#FFF8EE] flex flex-col relative mx-auto h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-3">
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

          {companions.length > 0 ? (
            companions.map((c) => (
              <CompanionCard
                key={`companion-${c.id}-${page}`}
                title={c.title}
                description={c.content}
                image={c.image}
                user={c.user}
                status={c.status}
                onClick={() => navigate(`/companion/${c.id}`)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-5">
              등록된 동행 모집글이 없습니다.
            </p>
          )}
          <div ref={loaderRef} className="h-10"></div>
        </main>

        <button
          className="fixed bottom-20 right-6 z-50 bg-[#FCA652] p-3 rounded-full shadow-lg text-white hover:bg-[#e59545] transition"
          onClick={() => navigate("/companion/write")}
        >
          <Pencil size={20} />
        </button>
      </div>
    </div>
  );
}
