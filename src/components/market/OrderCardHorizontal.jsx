import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";

export default function OrderCardHorizontal({ item }) {
  return (
    <section>
      <div className="bg-white rounded-xl shadow-soft border border-border w-full transition-all flex overflow-hidden">
        {/* ✅ 왼쪽 이미지 (정사각형) */}
        <div className="aspect-square w-[30%] relative">
          <img
            src={item.mainImageUrl}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ✅ 오른쪽 텍스트 콘텐츠 */}
        <div className="flex flex-col justify-between p-4 flex-1">
          {/* 제목 + 내용 */}
          <div>
            <h3 className="font-semibold text-base text-text line-clamp-1">
              {item.productName}
            </h3>
            <p className="text-muted text-sm leading-relaxed line-clamp-2">
              수량: {item.quantity}개
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            {/* 프로필 + 닉네임 */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text">
                {" "}
                {item.subtotal.toLocaleString()}원
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted">
              <Link
                key={item.itemId}
                to={`/market/product/${item.productId}`}
                className="group p-1 rounded-xl hover:bg-primary/20 cursor-pointer transition"
                title="장바구니 담기"
              >
                <ShoppingBasket
                  strokeWidth={2.5}
                  className="text-primary group-hover:text-primary/80 transition"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
