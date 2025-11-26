import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import Tag from "../../components/ui/Tag";

import { getAllCommunity } from "../../services/communityService";
import CommunityCard from "./CommunityCard";

export default function CommunityListPage() {
  const [communities, setCommunities] = useState([]);
  const [selectedTag, setSelectedTag] = useState("자유");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getAllCommunity(page, 10);
        setCommunities((prev) => {
          const merged = [...prev, ...data.content];
          return merged.filter(
            (item, i, self) => i === self.findIndex((p) => p.id === item.id)
          );
        });
        setHasMore(!data.last);
      } catch (error) {
        console.error("커뮤니티글 불러오기 실패:", error);
      }
    };
    fetchCommunities();
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
    setSelectedTag(tag);

    if (tag === "전체") navigate("/all-list");
    else if (tag === "동행 모집") navigate("/companion");
    else if (tag === "알바 구인") navigate("/parttime");
    else navigate("/community");  // 자유
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-[#FFF8EE] flex flex-col relative mx-auto h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-3">
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

          {communities.length > 0 ? (
            communities.map((c) => (
              <CommunityCard
                title={c.title}
                description={c.content}
                image={c.imageUrl}
                user={c.user}
                likeCount={c.likeCount}
                commentCount={c.commentCount}
                onClick={() => navigate(`/community/${c.id}`)}
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
          onClick={() => navigate("/community/write")}
        >
          <Pencil size={20} />
        </button>
      </div>
    </div>
  );
}
