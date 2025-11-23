import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Dot } from "lucide-react";
import useOrderStore from "../../stores/useOrderStore";
import OrderCardHorizontal from "../../components/market/OrderCardHorizontal";

const formatDate = (isoString) => {
  const date = isoString.substring(0, 10).replace(/-/g, ".");
  const time = isoString.substring(11, 16);
  return `${date} ${time}`;
};

export default function OrderorderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orderDetail, fetchOrderDetail, loading } = useOrderStore();

  useEffect(() => {
    if (orderId) fetchOrderDetail(orderId);
  }, [orderId]);

  if (loading || !orderDetail || !orderDetail.payment)
    return <p className="p-5">Loading...</p>;
  if (!orderDetail)
    return <p className="p-5">주문 정보를 불러오지 못했습니다.</p>;

  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto min-h-screen">
        <main className="flex-1 overflow-y-auto pb-24 p-5 mt-3 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="flex items-center gap-1 text-xl font-semibold">
              <button onClick={() => navigate(-1)}>
                <ChevronLeft className="cursor-pointer" />
              </button>
              주문 상세{" "}
            </h2>
            <span className="text-base">
              {formatDate(orderDetail.registeredAt)} 주문
            </span>
          </div>
          <div>
            <span className="text-sm">
              <Dot className="text-gray-400 inline-block" />
              주문번호 {orderDetail.payment.tossOrderId}
            </span>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-soft p-4 space-y-3">
            <h3 className="text-lg font-semibold">결제 정보</h3>

            <div className="flex justify-between text-sm text-muted">
              <span>총 결제 금액</span>
              <span>
                {(
                  orderDetail.totalAmount + orderDetail.shippingFee
                ).toLocaleString()}
                원
              </span>
            </div>

            <div className="flex justify-between text-sm text-muted">
              <span>결제 방식</span>
              <span>{orderDetail.payment.method}</span>
            </div>

            <div className="flex justify-between text-sm text-muted">
              <span>결제 승인 시간</span>
              <span>{orderDetail.payment.approvedAt.replace("T", " ")}</span>
            </div>

            <a
              href={orderDetail.payment.receiptUrl}
              target="_blank"
              className="text-primary underline text-sm"
            >
              영수증 보기
            </a>
          </div>

          {/* 배송지 */}
          <div className="bg-white border border-border rounded-xl shadow-soft p-5 space-y-3 mt-5">
            <h3 className="text-lg font-semibold">배송지</h3>

            <div className="flex  text-sm text-muted gap-2">
              <span>받는 분</span>
              <span>{orderDetail.shippingName}</span>
            </div>

            <div className="flex text-sm text-muted gap-2">
              <span>휴대폰</span>
              <span>{orderDetail.shippingMobile}</span>
            </div>

            <div className="flex flex-col text-sm text-muted">
              <span>주소</span>
              <span>{orderDetail.shippingAddress}</span>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            <h3 className="text-lg font-semibold">
              주문 상품 ({orderDetail.items.length}개)
            </h3>

            {orderDetail.items.map((item) => (
              <OrderCardHorizontal key={item.itemId} item={item} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
