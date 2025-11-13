import React from "react";
import { Heart, MessageSquare } from "lucide-react";

export default function CardGrid({ key, products, category }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{category}</h2>

      {/* ✅ 반응형 1~2열 그리드 */}
      <div className="grid grid-cols-2 gap-5">
        {products.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-soft overflow-hidden border border-border cursor-pointer hover:shadow-md transition-all"
          >
            {/* 이미지 */}
            <div className="relative">
              <img
                src={post.mainImageUrl}
                alt={post.name}
                className="w-full aspect-4/3 object-cover"
              />
              <span className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {post.category}
              </span>
            </div>

            {/* 본문 */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-base text-text line-clamp-1">
                {post.name}
              </h3>
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
