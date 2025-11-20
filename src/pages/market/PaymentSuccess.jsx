import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function PaymentSuccess() {
  const [params] = useSearchParams();

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  async function confirmPayment() {
    try {
      const res = await api.post("/payment/confirm", {
        paymentKey,
        orderId,
        amount,
      });

      console.log("결제 승인 성공:", res.data);
    } catch (e) {
      console.error("결제 승인 실패:", e);
    }
  }

  useEffect(() => {
    if (paymentKey && orderId && amount) {
      confirmPayment();
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>결제가 완료되었습니다 🎉</h2>
      <p>결제 금액: {amount}원</p>
    </div>
  );
}
