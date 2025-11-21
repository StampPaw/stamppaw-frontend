import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import Tag from "../../components/ui/Tag";

import { getAllCommunity } from "../../services/communityService";
import CommunityCard from "./CommunityCard";

export default function CommunityListPage() {
  const [communities, setCommunities] = useState([]);
  const [selectedTag, setSelectedTag] = useState("자유");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getAllCommunity(0, 10);
        setCommunities(data.content);
      } catch (error) {
        console.error("커뮤니티글 불러오기 실패:", error);
      }
    };
    fetchCommunities();
  }, []);

  const handleTagClick = (tag) => {
    if (tag === "전체") {
      navigate("/");
    } else if (tag === "동행 모집") {
      setSelectedTag(tag);
      navigate("/companion");
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-[#FFF8EE] flex flex-col relative mx-auto h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-3">
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

          {communities.length > 0 ? (
            communities.map((c) => (
              <CommunityCard
                key={c.id}
                title={c.title}
                description={c.content}
                image={c.image}
                user={c.user}
                onClick={() => navigate(`/community/${c.id}`)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-5">
              등록된 동행 모집글이 없습니다.
            </p>
          )}
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
