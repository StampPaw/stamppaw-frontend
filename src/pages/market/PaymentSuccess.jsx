import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  const [orderInfo, setOrderInfo] = useState(null);

  const [called, setCalled] = useState(false);
  const [result, setResult] = useState(null);

  async function confirmPayment() {
    try {
      const res = await api.post("/payment/confirm", {
        paymentKey,
        orderId,
        amount: Number(amount),
      });

      console.log("💯결제 승인 성공:", res.data);
      setResult(res.data);
    } catch (e) {
      console.error("🚩결제 승인 실패:", e);
    }
  }

  useEffect(() => {
    if (!called && paymentKey && orderId && amount) {
      setCalled(true); // Prevent second call
      confirmPayment();
    }
  }, [paymentKey, orderId, amount, called]);

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col items-center px-6 pt-24">
        {/* Icon */}
        <CheckCircle className="w-20 h-20 text-primary mb-4" />

        {/* Title */}
        <h2 className="text-2xl font-bold text-primary mb-2">
          결제가 완료되었습니다
        </h2>

        <p className="text-muted mb-8 text-center">
          주문이 정상적으로 처리되었습니다.
        </p>

        {/* 결제 정보 카드 */}
        <div className="bg-white rounded-xl shadow-soft border border-border w-full p-6 space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-muted">주문번호</span>
            <span className="font-semibold text-text">{orderId}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted">결제 금액</span>
            <span className="font-semibold text-primary text-lg">
              {Number(amount).toLocaleString()}원
            </span>
          </div>

          {orderInfo?.approvedAt && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">결제 일시</span>
              <span>{orderInfo.approvedAt}</span>
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-row w-full gap-3 pb-32">
          <button
            onClick={() => alert("작업중입니다.")}
            className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg shadow hover:bg-[#ff8a1e] transition"
          >
            주문 내역 보기
          </button>

          <button
            onClick={() => navigate("/market")}
            className="flex-1 bg-white border border-primary text-primary font-semibold py-3 rounded-lg hover:bg-primary/10 transition"
          >
            쇼핑하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
