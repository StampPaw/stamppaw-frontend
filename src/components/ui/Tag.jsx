import React, { useState } from "react";

export default function Tag() {
  const tags = ["전체", "자유", "알바 구인", "동행 모집"];
  const [selectedTag, setSelectedTag] = useState("자유");

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Tags</h2>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => {
          const isActive = tag === selectedTag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition
                ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "border-primary text-primary bg-[#FFF9F3] hover:bg-primary hover:text-white"
                }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </section>
  );
}
