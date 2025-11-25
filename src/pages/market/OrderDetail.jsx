import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Dot } from "lucide-react";
import useOrderStore from "../../stores/useOrderStore";
import OrderCardHorizontal from "../../components/market/OrderCardHorizontal";
import { formatDateTime } from "@/utils/date";

export default function OrderorderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const {
    orderDetail,
    allShippingStatus,
    fetchAllShippingStatuses,
    fetchOrderDetail,
    loading,
  } = useOrderStore();

  useEffect(() => {
    if (orderId) fetchOrderDetail(orderId);
  }, [orderId]);

  useEffect(() => {
    fetchAllShippingStatuses();
  }, []);

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
              {formatDateTime(orderDetail.registeredAt)} 주문
            </span>
          </div>
          <div>
            <span className="text-sm">
              <Dot className="text-gray-400 inline-block" />
              주문번호 {orderDetail.payment.tossOrderId}
            </span>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-soft p-4 space-y-3">
            <h3 className="text-lg font-semibold">
              결제 정보 :{" "}
              {orderDetail.payment.status === "READY" ? "미결제(결제대기)" : ""}
            </h3>

            {orderDetail.payment.status !== "READY" && (
              <>
                <div className="flex justify-between text-sm text-muted">
                  <span>총 결제 금액</span>
                  <span>
                    {(
                      orderDetail.totalAmount + orderDetail.shippingFee
                    ).toLocaleString()}
                    원 (상품 합 {orderDetail.totalAmount} + 배송비{" "}
                    {orderDetail.shippingFee})
                  </span>
                </div>

                <div className="flex justify-between text-sm text-muted">
                  <span>결제 방식</span>
                  <span>{orderDetail.payment.method}</span>
                </div>

                <div className="flex justify-between text-sm text-muted">
                  <span>결제 승인 시간</span>
                  <span>
                    {orderDetail.payment.approvedAt
                      ? formatDateTime(orderDetail.payment.approvedAt)
                      : "-"}
                  </span>
                </div>
              </>
            )}

            {orderDetail.payment.receiptUrl && (
              <a
                href={orderDetail.payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-sm"
              >
                영수증 보기
              </a>
            )}
          </div>

          <div className="bg-white border border-border rounded-xl shadow-soft p-5 space-y-3 mt-5">
            <h3 className="text-lg font-semibold">배송 정보</h3>
            {orderDetail.payment.status !== "READY" && (
              <div className="flex items-center justify-between w-full my-3">
                {allShippingStatus.map((st, idx) => {
                  const isActive = st.code === orderDetail.shippingStatus;

                  // 현재 단계 인덱스
                  const currentIdx = allShippingStatus.findIndex(
                    (s) => s.code === orderDetail.shippingStatus
                  );

                  const isPast = idx < currentIdx; //이전단계
                  const isFuture = idx > currentIdx; //다음단계

                  return (
                    <div key={st.code} className="flex items-center w-full">
                      <div
                        className={`w-3 h-3 rounded-full transition-all
            ${isActive ? "bg-primary" : ""}
            ${isPast ? "bg-primary/40" : ""}
            ${isFuture ? "bg-gray-300" : ""}
          `}
                      />
                      <span className="text-xs ml-1 whitespace-nowrap">
                        {st.label}
                      </span>
                      {idx < allShippingStatus.length - 1 && (
                        <div
                          className={`h-[2px] flex-1 mx-2 rounded-full 
              ${isPast ? "bg-primary/40" : "bg-gray-300"}
            `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
              <span> {orderDetail.shippingAddress}</span>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">
              주문 상품 ({orderDetail.items.length}개)
            </h3>

            {orderDetail.items.map((item) => (
              <OrderCardHorizontal key={item.itemId} item={item} />
            ))}
          </div>
          <button className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center  hover:bg-[#ff8a1e] transition mt-5">
            주문 취소
          </button>
        </main>
      </div>
    </div>
  );
}
