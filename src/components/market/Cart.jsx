import React from "react";
import { Minus, Plus, Image } from "lucide-react";

export default function Cart() {
  const product = {
    title: "Cute Dog Hoodie",
    description:
      "따뜻하고 귀여운 반려견 후드티 🐶 부드러운 소재로 제작되었습니다.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=60",
    likes: 12,
    comments: 4,
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Cart</h2>

      <div className="bg-white rounded-xl shadow-soft border border-border w-full h-40 cursor-pointer hover:shadow-md transition-all flex overflow-hidden">
        {/* ✅ 왼쪽 이미지 (높이에 맞는 정사각형) */}
        <div className="relative shrink-0 aspect-square h-full bg-input overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="w-8 h-8 text-primary opacity-70" />
          )}
        </div>

        {/* ✅ 오른쪽 콘텐츠 */}
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <h3 className="font-semibold text-text text-base line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm text-muted line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            {/* 수량 조절 */}
            <div className="flex items-center gap-3 mt-2">
              <button className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-text">1</span>
              <button className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <span className="font-semibold text-primary">
              € {product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
