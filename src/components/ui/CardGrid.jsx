import React from "react";
import { Heart, MessageSquare } from "lucide-react";

export default function CardGrid() {
  // 예시 데이터
  const products = [
    {
      id: 1,
      category: "의류",
      title: "따뜻한 겨울 퍼 자켓 🧥",
      content:
        "보들보들한 퍼 소재로 겨울 산책도 따뜻하게! 다양한 색상으로 준비했어요.",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      category: "의류",
      title: "산뜻한 봄 니트 조끼 🌼",
      content:
        "가벼운 니트 원단으로 봄철 산책에 딱! 귀여운 파스텔 컬러로 포인트 주세요.",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      category: "의류",
      title: "산책용 방수 레인코트 ☔",
      content:
        "비 오는 날에도 걱정 없이! 방수 원단과 조절 가능한 스트랩으로 편안하게 착용 가능.",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      category: "의류",
      title: "빈티지 데님 자켓 🐾",
      content:
        "귀여움 + 캐주얼함 한 번에! 어디서든 시선을 사로잡는 반려견 데님 자켓.",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Card Grid</h2>

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
                src={post.image}
                alt={post.title}
                className="w-full aspect-4/3 object-cover"
              />
              <span className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {post.category}
              </span>
            </div>

            {/* 본문 */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-base text-text line-clamp-1">
                {post.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                {post.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
