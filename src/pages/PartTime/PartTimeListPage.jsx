import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import Tag from "../../components/ui/Tag";

import { getPartTimeList } from "../../services/partTimeService";
import PartTimeCard from "./PartTimeCard";

export default function PartTimeListPage() {
  const [parttimes, setParttimes] = useState([]);
  const [selectedTag, setSelectedTag] = useState("알바 모집");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartTimes = async () => {
      try {
        const data = await getPartTimeList(page, 10);
        setParttimes((prev) => {
          const merged = [...prev, ...data.content];
          return merged.filter(
            (item, index, self) =>
              index === self.findIndex((p) => p.id === item.id)
          );
        });
        setHasMore(!data.last);
      } catch (error) {
        console.error("알바 글 불러오기 실패:", error);
      }
    };

    fetchPartTimes();
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
      setSelectedTag(tag);
      navigate("/community");
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-[#FFF8EE] flex flex-col relative mx-auto h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-3">
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

          {parttimes.length > 0 ? (
            parttimes.map((p) => (
              <PartTimeCard
                key={`parttime-${p.id}-${page}`}
                title={p.title}
                description={p.content}
                image={p.image || null}
                user={p.user}
                status={p.status}
                onClick={() => navigate(`/parttime/${p.id}`)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-5">
              등록된 알바 모집글이 없습니다.
            </p>
          )}

          <div ref={loaderRef} className="h-10"></div>
        </main>

        <button
          className="fixed bottom-20 right-6 z-50 bg-[#FCA652] p-3 rounded-full shadow-lg text-white hover:bg-[#e59545] transition"
          onClick={() => navigate("/parttime/write")}
        >
          <Pencil size={20} />
        </button>
      </div>
    </div>
  );
}
