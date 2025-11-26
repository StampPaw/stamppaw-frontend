import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBasket, Dot } from "lucide-react";

export default function OrderCardHorizontal({ item }) {
  return (
    <section>
      <div className="bg-white rounded-xl shadow-soft border border-border w-full transition-all flex overflow-hidden">
        <div className="aspect-square w-[30%] relative">
          <img
            src={item.mainImageUrl}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <h3 className="font-semibold text-base text-text line-clamp-1">
              {item.productName}
            </h3>

            <p className="text-muted text-sm leading-relaxed line-clamp-1 flex items-center gap-1">
              {item.optionSummary && (
                <>
                  <span>
                    <Dot className="text-gray-400 inline-block" />
                    옵션 - {item.optionSummary}
                  </span>
                </>
              )}
              <span>
                <Dot className="text-gray-400 inline-block" />
                수량 - {item.quantity}개
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text">
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
