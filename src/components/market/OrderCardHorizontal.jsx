import React from "react";
import { Heart, MessageSquare } from "lucide-react";

export default function CardHorizontal() {
  return (
    <section>
      <div className="bg-white rounded-xl shadow-soft border border-border w-full cursor-pointer hover:shadow-md transition-all flex overflow-hidden">
        {/* ✅ 왼쪽 이미지 (정사각형) */}
        <div className="aspect-square w-[30%] relative">
          <img
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=60"
            alt="post"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ✅ 오른쪽 텍스트 콘텐츠 */}
        <div className="flex flex-col justify-between p-4 flex-1">
          {/* 제목 + 내용 */}
          <div>
            <h3 className="font-semibold text-base text-text line-clamp-1">
              오늘도 산책 완료! 🐶
            </h3>
            <p className="text-muted text-sm leading-relaxed line-clamp-2">
              날씨가 좋아서 콩이랑 즐거운 산책을 했어요! 다음엔 공원도 가볼까
              해요 🌿 날씨가 좋아서 콩이랑 즐거운 산책을 했어요! 다음엔 공원도
              가볼까 해요 🌿
            </p>
          </div>

          {/* ✅ 하단 프로필 + 좋아요/댓글 */}
          <div className="flex items-center justify-between mt-3">
            {/* 프로필 + 닉네임 */}
            <div className="flex items-center gap-2">
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="author"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-text">hamtol</span>
            </div>

            {/* ❤️ 💬 */}
            <div className="flex items-center gap-3 text-xs text-muted">
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
      </div>
    </section>
  );
}
