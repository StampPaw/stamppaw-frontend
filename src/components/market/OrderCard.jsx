import React from "react";
import { Minus, Plus, Image } from "lucide-react";
import { Link } from "react-router-dom";
import useCartStore from "../../stores/useCartStore.js";

export default function OrderCard({ item, selectedItems, setSelectedItems }) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleDelete = () => {
    if (window.confirm("이 상품을 장바구니에서 삭제하시겠습니까?")) {
      removeItem(item.id);
      setSelectedItems((prev) => prev.filter((id) => id !== item.id));
    }
  };

  return (
    <section>
      <div className="bg-white rounded-xl shadow-soft border border-border w-full h-40 hover:shadow-md transition-all flex overflow-hidden">
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
            <h3 className="flex justify-between items-center">
              <Link
                to={`/market/product/${item.productId}`}
                className="hover:underline font-semibold text-text text-base line-clamp-1"
              >
                {item.productName}
              </Link>
              <button
                onClick={handleDelete}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                삭제
              </button>
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

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium text-text">
                {item.quantity}
              </span>
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
