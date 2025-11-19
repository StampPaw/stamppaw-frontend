import { useLocation } from "react-router-dom";

export default function PaymentFail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return (
    <div style={{ padding: 20 }}>
      <h2>결제에 실패했습니다 ❌</h2>
      <p>사유: {params.get("message")}</p>
    </div>
  );
}
