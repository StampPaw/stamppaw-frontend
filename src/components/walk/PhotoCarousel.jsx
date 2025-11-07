import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Image } from "lucide-react";

export default function PhotoCarousel({ photos, setPhoto }) {
  const [current, setCurrent] = useState(0);
  const [previews, setPreviews] = useState([]);

  // ✅ 파일 -> 미리보기 URL 생성
  useEffect(() => {
    if (!photos || photos.length === 0) return;
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  const total = previews.length;

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));

  const removePhoto = (index) => {
    const newFiles = [...photos];
    newFiles.splice(index, 1);
    setPhoto(newFiles);
    if (current >= newFiles.length) setCurrent(Math.max(0, newFiles.length - 1));
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full mx-auto bg-bg shadow-soft overflow-hidden rounded-xl">
      {/* ✅ 이미지 영역 */}
      <div className="relative flex items-center justify-center h-60 bg-input rounded-xl overflow-hidden">
        {previews[current] ? (
          <img
            src={previews[current]}
            alt={`preview-${current}`}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <Image className="w-10 h-10 text-border" />
        )}

        {/* ✅ 삭제 버튼 */}
        <button
          onClick={() => removePhoto(current)}
          className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black transition"
          title="사진 삭제"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 좌우 화살표 */}
        {total > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-sm hover:bg-white transition"
            >
              <ChevronLeft className="w-5 h-5 text-primary" strokeWidth={2.2} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-sm hover:bg-white transition"
            >
              <ChevronRight className="w-5 h-5 text-primary" strokeWidth={2.2} />
            </button>
          </>
        )}
      </div>

      {/* ✅ 하단 점 인디케이터 */}
      <div className="flex justify-center gap-2 py-3">
        {previews.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-primary" : "bg-secondary"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
