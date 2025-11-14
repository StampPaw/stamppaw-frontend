import React, { useState } from "react";
import { ShoppingBasket } from "lucide-react";
import { OptionTag } from "./OptionTag.jsx";

export default function ProductCard({ product }) {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleSelectOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = () => {
    if (product.options.length > 0) {
      // 옵션 선택 여부 확인
      const missing = product.options.filter(
        (opt) => !selectedOptions[opt.name]
      );

      if (missing.length > 0) {
        return alert(
          `옵션을 선택해주세요: ${missing.map((m) => m.name).join(", ")}`
        );
      }
    }

    // 실제로 보내야 할 데이터 예시
    const cartItem = {
      productId: product.id,
      quantity: 1,
      options: selectedOptions,
    };

    console.log("장바구니 데이터:", cartItem);

    alert("장바구니에 추가되었습니다!");
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{product.name}</h2>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-border w-full">
        <div className="relative">
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
          <span className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {Math.floor(product.price).toLocaleString()}원
          </span>
        </div>

        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-lg text-text">
            {product.name}
            <span className="text-base">
              {Math.floor(product.price).toLocaleString()}원
            </span>
          </h3>
          <p className="text-muted text-sm">{product.description}</p>

          {/* 옵션 영역 */}
          <div className="space-y-3">
            {product.options?.map((opt) => (
              <div key={opt.id}>
                <p className="font-semibold text-sm mb-2">{opt.name}</p>
                <OptionTag
                  option={opt}
                  selected={selectedOptions[opt.name]}
                  onSelect={handleSelectOption}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ff8a1e] transition"
          >
            <ShoppingBasket /> 장바구니에 추가하기
          </button>
        </div>
      </div>
    </section>
  );
}
