import React, { useEffect, useState } from "react";
import useOrderStore from "../../stores/useOrderStore";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { useNavigate, Link, useParams } from "react-router-dom";
import OrderCardHorizontal from "../../components/market/OrderCardHorizontal.jsx";

const formatDate = (isoString) => {
  const date = isoString.substring(0, 10).replace(/-/g, ".");
  const time = isoString.substring(11, 16);
  return `${date} ${time}`;
};

export default function OrderList() {
  const navigate = useNavigate();
  const { orderStatus } = useParams();

  const {
    orders,
    loading,
    error,
    getUserOrders,
    page,
    size,
    hasNext,
    fetchNextPage,
  } = useOrderStore();

  useEffect(() => {
    console.log("📌 orderStatus :", orderStatus);
    getUserOrders(orderStatus);
  }, [orderStatus]);

  if (loading) return <p className="p-5">Loading...</p>;
  if (error) return <p className="p-5 text-red-500">에러가 발생했습니다.</p>;

  //console.log("getUserOrders:", getUserOrders);

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white text-text font-sans min-h-screen flex justify-center">
        <div className="w-full sm:max-w-[500px] bg-bg flex flex-col items-center justify-center px-5">
          <div className="text-center space-y-4 pt-32">
            <div className="flex justify-center">
              <ShoppingBag className="w-16 h-16 text-primary opacity-80" />
            </div>

            <h2 className="text-xl font-semibold text-text">
              주문 내역이 없어요.
            </h2>

            <p className="text-muted text-sm">
              마음에 드는 상품을 장바구니에 담아 주문해보세요!
            </p>

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

  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 mt-3 space-y-5">
          <h2 className="flex justify-between items-center text-xl font-semibold mb-4">
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)}>
                <ChevronLeft className="cursor-pointer" />
              </button>
              <span>주문 내역</span>
            </div>

            <Link
              to={"/market/orders/CANCELED"}
              className="text-xl hover:underline cursor-pointer"
            >
              취소/반품
            </Link>
          </h2>

          {orders.map((order) => (
            <div
              key={order.orderId}
              className=" bg-white border border-border rounded-xl shadow-soft p-3 space-y-2"
            >
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>{formatDate(order.registeredAt)} 주문</span>
                <Link
                  to={`/market/order/${order.orderId}`}
                  className="text-sm text-primary hover:underline cursor-pointer"
                >
                  상세보기
                </Link>
              </div>

              <hr />
              <div className="flex justify-between text-sm text-muted">
                <span>총 결제금액 </span>
                <span>
                  {(order.totalAmount + order.shippingFee).toLocaleString()}원
                </span>
                <span>배송 상태</span>
                <span> {order.shippingStatus}</span>
              </div>
              {order.items.map((item) => (
                <OrderCardHorizontal key={item.itemId} item={item} />
              ))}
            </div>
          ))}
          <button
            onClick={() => fetchNextPage(orderStatus)}
            disabled={!hasNext}
            className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ff8a1e] transition disabled:bg-gray-300 disabled:text-gray-500"
          >
            {hasNext ? "더보기" : "마지막 페이지"}
          </button>
        </main>
      </div>
    </div>
  );
}
