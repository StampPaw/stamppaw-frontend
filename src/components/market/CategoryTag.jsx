import React from "react";

export default function CategoryTag({ tags = [], selectedTag, onTagClick }) {
  return (
    <section>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => {
          const isActive = tag.label === selectedTag;

          return (
            <button
              key={tag.value}
              onClick={() => onTagClick(tag.label)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition
                ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "border-primary text-primary bg-[#FFF9F3] hover:bg-primary hover:text-white"
                }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
