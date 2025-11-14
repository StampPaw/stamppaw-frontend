import React from "react";
import { Heart, MessageSquare } from "lucide-react";

export default function Card() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Cards</h2>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-border w-full cursor-pointer hover:shadow-md transition-all">
        {/* ✅ 프로필 영역 (상단으로 이동) */}
        <div className="flex items-center gap-2 p-4">
          <img
            src="https://randomuser.me/api/portraits/women/65.jpg"
            alt="author"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-text">hamtol</span>
        </div>

        {/* ✅ 이미지 */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=60"
            alt="post"
            className="w-full aspect-square object-cover"
          />
          <span className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            산책
          </span>
        </div>

        {/* ✅ 본문 */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg text-text line-clamp-1">
            오늘도 산책 완료! 🐶
          </h3>
          <p className="text-muted text-sm leading-relaxed line-clamp-2">
            날씨가 좋아서 콩이랑 즐거운 산책을 했어요! 다음엔 공원도 가볼까 해요 🌿
          </p>

          {/* ✅ 좋아요 / 댓글 */}
          <div className="flex items-center gap-5 text-sm text-muted pt-2">
            <button className="flex items-center gap-1 hover:text-primary transition">
              <Heart className="w-4 h-4" />
              <span>12</span>
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition">
              <MessageSquare className="w-4 h-4" />
              <span>5</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
