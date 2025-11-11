import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";

export default function LatestCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prevSlide = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const nextSlide = () => setCurrent((prev) => Math.min(prev + 1, total - 1));

  console.log("LatestCarousel images:", images);

  // ✅ 4초마다 자동 슬라이드 전환
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, [total]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-60 bg-input flex items-center justify-center rounded-xl">
        <Image className="w-10 h-10 text-border" />
      </div>
    );
  }

  return (
    <section>
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
          {current > 1 && (
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
