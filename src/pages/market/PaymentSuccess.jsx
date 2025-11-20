import { useLocation } from "react-router-dom";
import api from "../../services/api";

export default function PaymentSuccess() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const paymentKey = query.get("paymentKey");
  const orderId = query.get("orderId");
  const amount = query.get("amount");

  // 서버로 승인 요청
  async function confirmPayment() {
    try {
      const res = await api.get(
        `/payment/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`
      );
      console.log("결제 승인 성공:", res.data);
    } catch (e) {
      console.error("결제 승인 실패:", e);
    }
  }

  useEffect(() => {
    confirmPayment();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>결제가 완료되었습니다 🎉</h2>
      <p>결제 금액: {amount}원</p>
    </div>
  );
}
