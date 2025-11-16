import React, { useEffect, useState } from "react";
import CartCard from "../../components/market/CartCard.jsx";
import useCartStore from "../../stores/useCartStore.js";
import { ShoppingBasket, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartList() {
  const { cart, fetchCart, loading } = useCartStore();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart?.items) {
      setSelectedItems(cart.items.map((i) => i.id));
    }
  }, [cart]);

  if (loading) return <p className="p-5">Loading...</p>;

  //console.log("⭐Cart cart:", cart);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-white text-text font-sans min-h-screen flex justify-center">
        <div className="w-full sm:max-w-[500px] bg-bg flex flex-col items-center justify-center px-5">
          <div className="text-center space-y-4 pt-32">
            <div className="flex justify-center">
              <ShoppingBasket className="w-16 h-16 text-primary opacity-80" />
            </div>

            <h2 className="text-xl font-semibold text-text">
              장바구니가 비어있어요
            </h2>

            <p className="text-muted text-sm">마음에 드는 상품을 담아보세요!</p>

            <button
              onClick={() => navigate("/market")}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#ff8a1e] transition text-sm font-semibold"
            >
              쇼핑하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = selectedItems.reduce((sum, itemId) => {
    const item = cart.items.find((i) => i.id === itemId);
    return sum + (item?.subtotal || 0);
  }, 0);

  const shippingFee = totalPrice < 50000 ? 3000 : 0;
  const finalAmount = totalPrice + shippingFee;

  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <h2 className="flex items-center gap-1 text-xl font-semibold mb-4">
            <button onClick={() => navigate(-1)}>
              <ChevronLeft className="cursor-pointer" />
            </button>
            장바구니 ({cart.items.length})
          </h2>

          {cart.items.map((item) => (
            <CartCard
              key={item.id}
              item={item}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          ))}

          <div className="bg-white border border-border rounded-xl shadow-soft p-5 space-y-3">
            <h3 className="text-lg font-semibold">주문 예상 금액</h3>

            <div className="flex justify-between text-sm text-muted">
              <span>총 상품 가격</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>

            <div className="flex justify-between text-sm text-muted">
              <span>총 배송비</span>
              <span>+ {shippingFee.toLocaleString()}원</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg  text-primary">
              <span>결제 예상 금액</span>
              <span className="text-2xl font-bold">
                {finalAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          <button className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ff8a1e] transition">
            주문 하기
          </button>
        </main>
      </div>
    </div>
  );
}
