import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  const [called, setCalled] = useState(false);
  const [result, setResult] = useState(null);

  async function confirmPayment() {
    try {
      const res = await api.post("/payment/confirm", {
        paymentKey,
        orderId,
        amount: Number(amount),
      });

      console.log("keys:", Object.keys(res.data));
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
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-5 mt-5">
          <h2 className="flex items-center justify-between text-xl font-semibold w-full">
            <div className="flex items-center gap-1">
              <ChevronLeft />
              결제완료
            </div>
            <div className="flex items-center text-xs">
              <span className="bg-primary/50 text-white px-2 py-1 rounded-full shadow">
                장바구니
              </span>
              <ChevronRight className="text-primary/50" />
              <span className="bg-primary/50 text-white px-2 py-1 rounded-full shadow">
                주문/결제
              </span>
              <ChevronRight className="text-primary" />
              <span className="bg-primary text-white px-2 py-1 rounded-full shadow">
                결제완료
              </span>
            </div>
          </h2>
          <div className="flex flex-col items-center text-center mt-20">
            <CheckCircle className="w-20 h-20 text-primary mb-10" />
            <h2 className="text-2xl font-bold text-primary mb-5">
              결제가 완료되었습니다
            </h2>
            <p className="text-muted mb-8 text-center">
              주문이 정상적으로 처리되었습니다.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-border w-full p-3 space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-muted">주문번호</span>
              <span className="font-semibold text-text whitespace-nowrap">
                {orderId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">주문 상품명</span>
              <span className="font-semibold text-text">
                {result?.orderName || "상품 구매"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted">결제 금액</span>
              <span className="font-semibold text-primary text-lg">
                {Number(amount).toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="flex flex-row w-full gap-3 pb-32">
            <button
              onClick={() => navigate("/market/orders/ORDER")}
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
        </main>
      </div>
    </div>
  );
}
