import React from "react";
import { Minus, Plus, Image } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../stores/useCartStore.js";

export default function CartCard({ item }) {
  const navigate = useNavigate();
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <section>
      <div className="bg-white rounded-xl shadow-soft border border-border w-full h-40 cursor-pointer hover:shadow-md transition-all flex overflow-hidden">
        {/* 이미지 */}
        <div className="relative shrink-0 aspect-square h-full bg-input overflow-hidden">
          <Link to={`/market/product/${item.productId}`}>
            {item.mainImageUrl ? (
              <img
                src={item.mainImageUrl}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image className="w-8 h-8 text-primary opacity-70" />
            )}
          </Link>
        </div>

        {/* 오른쪽 내용 */}
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <h3 className="font-semibold text-text text-base line-clamp-1">
              <Link
                to={`/market/product/${item.productId}`}
                className="hover:underline"
              >
                {item.productName}
              </Link>
            </h3>

            <p className="text-sm text-muted line-clamp-2 mt-1">
              {item.optionSummary || ""}
            </p>
          </div>
          <div>
            <p className="text-base font-semibold line-clamp-2 mt-1">
              {Math.floor(item.price).toLocaleString()}원
            </p>
          </div>

          {/* 수량 · 가격 영역 */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() =>
                  updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                }
                className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-sm font-medium text-text">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <span className="font-semibold text-primary">
              {Number(item.subtotal).toLocaleString()} 원
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
