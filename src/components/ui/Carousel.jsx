import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";

const images = [
  "https://picsum.photos/id/237/800/600",
  "https://picsum.photos/id/433/800/600",
  "https://picsum.photos/id/659/800/600",
  "https://picsum.photos/id/821/800/600",
  "https://picsum.photos/id/1025/800/600",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prevSlide = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const nextSlide = () => setCurrent((prev) => Math.min(prev + 1, total - 1));

  // ✅ 4초마다 자동 슬라이드 전환
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, [total]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Carousel</h2>
      <div className="relative w-full mx-auto bg-bg shadow-soft overflow-hidden rounded-xl">
        {/* 이미지 영역 */}
        <div className="relative flex items-center justify-center h-60 bg-input rounded-xl overflow-hidden">
          {images[current] ? (
            <img
              src={images[current]}
              alt={`slide-${current}`}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Image className="w-10 h-10 rounded-xl text-border" />
          )}

          {/* 좌우 화살표 */}
          {current > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-sm hover:bg-white transition"
            >
              <ChevronLeft className="w-5 h-5 text-primary" strokeWidth={2.2} />
            </button>
          )}
          {current < total - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-sm hover:bg-white transition"
            >
              <ChevronRight
                className="w-5 h-5 text-primary"
                strokeWidth={2.2}
              />
            </button>
          )}
        </div>

        {/* 하단 점 인디케이터 */}
        <div className="flex justify-center gap-2 py-3">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-primary" : "bg-secondary"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
