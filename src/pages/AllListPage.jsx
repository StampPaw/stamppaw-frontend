import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tag from "../components/ui/Tag";

import { getAllCompanions } from "../services/companionService";
import { getAllCommunity } from "../services/communityService";
import { getPartTimeList } from "../services/partTimeService";

import CompanionCard from "../pages/companion/CompanionCard";
import CommunityCard from "../pages/community/CommunityCard";
import PartTimeCard from "../pages/PartTime/PartTimeCard";

export default function AllListPage() {
  const [companions, setCompanions] = useState([]);
  const [freePosts, setFreePosts] = useState([]);
  const [partTimes, setPartTimes] = useState([]);

  const [selectedTag, setSelectedTag] = useState("전체");
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const comp = await getAllCompanions(0, 10);
        const free = await getAllCommunity(0, 10);
        const part = await getPartTimeList(0, 10);

        setCompanions(comp.content);
        setFreePosts(free.content);
        setPartTimes(part.content);
      } catch (err) {
        console.error("전체 불러오기 실패:", err);
      }
    };
    fetchAll();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    if (tag === "동행 모집") navigate("/companion");
    else if (tag === "자유") navigate("/community");
    else if (tag === "알바 구인") navigate("/parttime");
    else navigate("/all-list");
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-[#FFF8EE] flex flex-col relative mx-auto h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-3">
          <Tag selectedTag={selectedTag} onTagClick={handleTagClick} />

          {companions.map((c) => (
            <CompanionCard
              key={`comp-${c.id}`}
              title={c.title}
              description={c.content}
              image={c.image}
              user={c.user}
              status={c.status}
              onClick={() => navigate(`/companion/${c.id}`)}
            />
          ))}
          {freePosts.map((c) => (
            <CommunityCard
              key={`free-${c.id}`}
              title={c.title}
              description={c.content}
              image={c.imageUrl}
              user={c.user}
              onClick={() => navigate(`/community/${c.id}`)}
            />
          ))}
          {partTimes.map((p) => (
            <PartTimeCard
              key={`part-${p.id}`}
              title={p.title}
              description={p.content}
              image={p.image}
              user={p.user}
              status={p.status}
              onClick={() => navigate(`/parttime/${p.id}`)}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
