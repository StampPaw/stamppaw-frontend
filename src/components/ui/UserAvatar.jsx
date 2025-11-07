import React from "react";
import { User } from "lucide-react";

/**
 * UserAvatar
 * 사용자 프로필 이미지를 표시하는 공용 컴포넌트
 * @param {string} image - 사용자 프로필 이미지 URL
 * @param {string} alt - 대체 텍스트
 * @param {string} size - 크기 ('sm' | 'md' | 'lg')
 */
export default function UserAvatar({ image, alt = "user", size = "md" }) {
  const sizeClass =
    size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-7 h-7"; // default md

  const iconSizeClass =
    size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return image ? (
    <img
      src={image}
      alt={alt}
      className={`${sizeClass} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${sizeClass} rounded-full bg-orange-100 flex items-center justify-center`}
    >
      <User className={`${iconSizeClass} text-orange-500`} />
    </div>
  );
}
