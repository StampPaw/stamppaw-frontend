import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const companionData = await getAllCompanions(0, 10);
        setCompanions(companionData.content);

        const freeData = await getAllCommunity(0, 10);
        setFreePosts(freeData.content);
      } catch (error) {
        console.error("동행 모집글 불러오기 실패:", error);
      }
    };
    fetchCompanions();
  }, []);

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
                  key={`companion-${c.id}`}
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
                  key={`free-${post.id}`}
                  title={post.title}
                  description={post.content}
                  image={post.imageUrl}
                  user={post.user}
                  onClick={() => navigate(`/community/${post.id}`)}
                />
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
