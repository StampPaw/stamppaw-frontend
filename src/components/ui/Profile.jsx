import React from "react";
import { Edit3 } from "lucide-react";

export default function Profile() {
  const posts = Array.from({ length: 9 });

  const dogs = [
    {
      id: 1,
      name: "콩이",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      name: "보리",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      name: "루이",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text font-sans flex justify-center">
      <div className="w-full bg-bg flex flex-col pb-10">
        {/* 🧍 프로필 영역 */}
        <section className="bg-white p-5 shadow-soft rounded-3xl">
          <div className="flex items-start gap-4">
            {/* 프로필 이미지 */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-input flex items-center justify-center text-4xl text-muted">
                🐾
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full shadow-soft hover:bg-[#ff8a1e] transition">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-base">hamtol</h2>
                  <p className="text-sm text-muted">
                    자기소개를 입력해 보세요!
                  </p>
                </div>
                <button className="bg-primary text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-[#ff8a1e] transition">
                  팔로우
                </button>
              </div>

              {/* 통계 */}
              <div className="flex gap-5 mt-4 text-xs">
                <span className="text-muted">
                  <span className="text-primary font-semibold">12</span>{" "}
                  산책기록
                </span>
                <span className="text-muted">
                  <span className="text-primary font-semibold">120</span> 팔로워
                </span>
                <span className="text-muted">
                  <span className="text-primary font-semibold">120</span> 팔로잉
                </span>
              </div>
            </div>
          </div>

          {/* 반려동물 리스트 */}
          <div className="flex gap-3 overflow-x-auto mt-5 pb-2 scrollbar-hide">
            {dogs.map((dog) => (
              <div
                key={dog.id}
                className="flex flex-col items-center shrink-0 w-16"
              >
                <div className="w-12 h-12 bg-input rounded-full overflow-hidden mb-1">
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-text text-center">
                  {dog.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 탭 메뉴 */}
        <nav className="flex items-center justify-around bg-bg rounded-full mt-5 mb-3 text-sm font-medium">
          {["자유", "산책 기록", "커뮤니티"].map((tab, i) => (
            <button
              key={tab}
              className={`relative flex-1 text-center py-2 mx-1 rounded-full transition-all duration-300
        ${
          i === 2 // 활성 탭 (예: 커뮤니티)
            ? "bg-white/70 text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
            : "text-muted hover:text-primary"
        }`}
            >
              {tab}
              {/* 탭 간 구분선 */}
              {i < 2 && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-px bg-border/60"></span>
              )}
            </button>
          ))}
        </nav>

        {/* 게시물 그리드 */}
        <section className="grid grid-cols-3 gap-2">
          {posts.map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-input rounded-lg flex items-center justify-center text-boder"
            >
              📷
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
