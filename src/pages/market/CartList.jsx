import React, { useEffect, useState } from "react";
import CartCard from "../../components/market/CartCard.jsx";
import useCartStore from "../../stores/useCartStore.js";
import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartList() {
  const { cart, fetchCart, loading } = useCartStore();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  // 💛 개발용 Mock 데이터 (JWT 없이도 테스트 가능) ===시작
  const devMockCart = {
    cartId: 1,
    items: [
      {
        id: 5,
        productId: 3,
        productName: "프린팅티셔츠",
        mainImageUrl:
          "https://stamppaw.s3.ap-northeast-2.amazonaws.com/be406c7d-46ef-47b7-a782-cbc6acd18daa%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-11-06%20205046.png",
        optionSummary: "SIZE:L / 색상: WHITE",
        price: 45000,
        quantity: 2,
        subtotal: 90000,
      },
      {
        id: 7,
        productId: 6,
        productName: "볼캡야구모자",
        mainImageUrl:
          "https://stamppaw.s3.ap-northeast-2.amazonaws.com/e860de06-5c8d-4a67-a96e-e7a9fdc1cf1a%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-11-13%20164334.png",
        optionSummary: "",
        price: 25000,
        quantity: 1,
        subtotal: 25000,
      },
    ],
  };

  useEffect(() => {
    if (!cart) {
      useCartStore.setState({ cart: devMockCart });
    }
  }, [cart]);

  const cartData = cart; // 이제 cart 자체에 mock 들어있음 === 끝

  if (loading) return <p className="p-5">Loading...</p>;

  // 🎨 비어있는 장바구니 UI
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
    const item = cartData.items.find((i) => i.id === itemId);
    return sum + (item?.subtotal || 0);
  }, 0);

  const shippingFee = selectedItems.length > 0 ? 3000 : 0;
  const finalAmount = totalPrice + shippingFee;
  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <h2 className="flex items-center gap-1 text-xl font-semibold mb-4">
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

            <div className="flex justify-between text-lg font-bold text-primary">
              <span>결제 예상 금액</span>
              <span className="text-2xl">{finalAmount.toLocaleString()}원</span>
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
