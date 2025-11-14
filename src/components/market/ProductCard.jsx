import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBasket, Plus, Minus } from "lucide-react";
import { OptionTag } from "./OptionTag.jsx";
import useCartStore from "../../stores/useCartStore.js";

export default function ProductCard({ product }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const { cart, fetchCart, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();
  //const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartCount = 0;

  const handleSelectOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAddToCart = () => {
    if (product.options?.length > 0) {
      const missing = product.options.filter(
        (opt) => !selectedOptions[opt.name]
      );

      if (missing.length > 0) {
        return alert(
          `옵션을 선택해주세요: ${missing.map((m) => m.name).join(", ")}`
        );
      }
    }

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
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        {product.name}
        <span
          onClick={() => navigate(`/market/cart`)}
          className="relative inline-flex items-center justify-center 
             w-8 h-8 rounded-full bg-white shadow 
             cursor-pointer hover:bg-gray-50 transition"
        >
          <ShoppingBasket className="text-primary" />

          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white 
                 text-[10px] font-bold w-4 h-4 flex items-center justify-center 
                 rounded-full shadow"
            >
              {cartCount}
            </span>
          )}
        </span>
      </h2>

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
          <h3 className="font-semibold text-lg text-text">{product.name}</h3>
          <span className="text-base font-semibold">
            {Math.floor(product.price).toLocaleString()}원
          </span>

          <p className="text-muted text-sm">{product.description}</p>

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

          <div>
            {cart?.items?.map((item) => (
              <div key={item.cartItemId}>
                {item.name} - {item.quantity}
                <button
                  onClick={() =>
                    updateQuantity(item.cartItemId, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button onClick={() => removeItem(item.cartItemId)}>
                  삭제
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2 font-semibold text-sm">
            수량
            <button className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-text">1</span>
            <button className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ff8a1e] transition"
          >
            <Plus /> 장바구니에 추가하기
          </button>
        </div>
      </div>
    </section>
  );
}
