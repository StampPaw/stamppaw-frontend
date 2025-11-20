import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import SearchBar from "../../components/ui/SearchBar";
import Tag from "../../components/ui/Tag";

import { getAllCompanions } from "../../services/companionService";
import CompanionCard from "./CompanionCard";

export default function CompanionListPage() {
  const [companions, setCompanions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("동행 모집");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const data = await getAllCompanions(0, 10);
        setCompanions(data.content);
      } catch (error) {
        console.error("동행 모집글 불러오기 실패:", error);
      }
    };
    fetchCompanions();
  }, []);

  const handleTagClick = (tag) => {
    if (tag === "전체") navigate("/");
    else setSelectedTag(tag);
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-[#FFF8EE] flex flex-col relative mx-auto h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-3">
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

          {companions.length > 0 ? (
            companions.map((c) => (
              <CompanionCard
                key={c.id}
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
