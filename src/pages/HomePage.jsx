import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import Tag from "../components/ui/Tag";
import { getAllCompanions } from "../services/companionService";
import { getAllCommunity } from "../services/communityService";
import CompanionCard from "../pages/companion/CompanionCard";
import CommunityCard from "./community/CommunityCard";

export default function HomePage() {
  const [companions, setCompanions] = useState([]);
  const [freePosts, setFreePosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("전체");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const companionData = await getAllCompanions(page, 10);
        const freeData = await getAllCommunity(page, 10);

        setCompanions((prev) => {
          const merged = [...prev, ...companionData.content];
          return merged.filter(
            (item, index, self) =>
              index === self.findIndex((p) => p.id === item.id)
          );
        });

        setFreePosts((prev) => {
          const merged = [...prev, ...freeData.content];
          return merged.filter(
            (item, index, self) =>
              index === self.findIndex((p) => p.id === item.id)
          );
        });

        setHasMore(!companionData.last || !freeData.last);
      } catch (error) {
        console.error("동행 모집글 불러오기 실패:", error);
      }
    };

    fetchContents();
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
    if (tag === "동행 모집") {
      navigate("/companion");
    } else if (tag == "자유") {
      navigate("/community");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-[#FFF8EE] flex flex-col relative mx-auto h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-3">
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

          {companions.length === 0 && freePosts.length === 0 ? (
            <p className="text-center text-gray-500 mt-5">
              등록된 글이 없습니다.
            </p>
          ) : (
            <>
              {companions.map((c) => (
                <CompanionCard
                  key={`companion-${c.id}-${page}`}
                  title={c.title}
                  description={c.content}
                  image={c.image}
                  user={c.user}
                  status={c.status}
                  onClick={() => navigate(`/companion/${c.id}`)}
                />
              ))}
              {freePosts.map((post) => (
                <CommunityCard
                  key={`free-${post.id}-${page}`}
                  title={post.title}
                  description={post.content}
                  image={post.imageUrl}
                  user={post.user}
                  onClick={() => navigate(`/community/${post.id}`)}
                />
              ))}
            </>
          )}
          <div ref={loaderRef} className="h-10"></div>
        </main>
      </div>
    </div>
  );
}
