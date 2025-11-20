import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import React, { useEffect, useState } from "react";
import useOrderStore from "../../stores/useOrderStore.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder } = useOrderStore();

  const orderData = location.state?.orderData;

  const [shippingName, setShippingName] = useState("");
  const [shippingMobile, setShippingMobile] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentWidget, setPaymentWidget] = useState(null);

  const parseJwt = (token) => {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      return payload;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function initWidget() {
      try {
        const token = localStorage.getItem("token");
        const payload = parseJwt(token);
        const customerKey = payload?.userId
          ? `user_${payload.userId}`
          : `guest_${crypto.randomUUID()}`;

        console.log("🔵 customerKey:", customerKey);

        const widget = await loadPaymentWidget(
          import.meta.env.VITE_TOSS_CLIENT_KEY,
          customerKey
        );

        setPaymentWidget(widget);
      } catch (err) {
        console.error("❌ [에러] loadPaymentWidget 실패:", err);
      }
    }

    initWidget();
  }, []);

  useEffect(() => {
    if (!paymentWidget || !orderData) return;

    paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: Number(orderData.finalAmount) },
      { variantKey: "DEFAULT" }
    );
  }, [paymentWidget, orderData]);

  useEffect(() => {
    if (orderData) {
      console.log("📦 주문 페이지로 전달된 CartId:", orderData);
    }
  }, [orderData]);

  if (!orderData) {
    return (
      <div className="p-5 text-center">
        <p className="text-red-500 font-semibold mb-3">
          잘못된 접근입니다. 주문 정보가 존재하지 않습니다.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const handleOrder = async () => {
    if (!shippingName || !shippingMobile || !shippingAddress) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }

    const order = await createOrder({
      cartId: orderData.cartId,
      cartItemIds: orderData.cartItemIds,
      shippingName,
      shippingMobile,
      shippingAddress,
      shippingFee: orderData.shippingFee,
    });

    const readyRes = await api.post("/payment/checkout", {
      amount: Number(orderData.finalAmount),
      orderName: "상품 결제", // tossOrderId는 backend가 생성
      orderId: order.id,
    });

    const { payment } = readyRes.data;
    console.log("💫", payment);
    const tossOrderId = payment.tossOrderId;

    await paymentWidget.requestPayment({
      method: "CARD",
      orderId: tossOrderId,
      orderName: payment.orderName,
      amount: payment.amount,
      successUrl: `${window.location.origin}/market/payment/success`,
      failUrl: `${window.location.origin}/market/payment/fail`,
    });
  };

  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-5">
          <h2 className="flex items-center justify-between text-xl font-semibold mb-4 w-full">
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)}>
                <ChevronLeft className="cursor-pointer" />
              </button>
              주문/결제
            </div>

            <div className="flex items-center text-xs">
              <span className="bg-primary/50 text-white px-2 py-1 rounded-full shadow">
                장바구니
              </span>
              <ChevronRight className="text-primary/50" />
              <span className="bg-primary/80 text-white px-2 py-1 rounded-full shadow">
                주문/결제
              </span>
              <ChevronRight className="text-primary/50" />
              <span className="bg-primary/50 text-white px-2 py-1 rounded-full shadow">
                결제완료
              </span>
            </div>
          </h2>

          <div className="bg-white border border-border rounded-xl shadow-soft p-5 space-y-3">
            <h3 className="text-lg font-semibold">결제 금액</h3>

            <div className="flex justify-between text-sm text-muted">
              <span>총 상품 가격</span>
              <span>{orderData.totalPrice.toLocaleString()} 원</span>
            </div>

            <div className="flex justify-between text-sm text-muted">
              <span>총 배송비</span>
              <span>{orderData.shippingFee.toLocaleString()} 원</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg  text-primary">
              <span>결제 금액</span>
              <span className="text-2xl font-bold">
                {orderData.finalAmount.toLocaleString()} 원
              </span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-soft p-5 space-y-3">
            <h3 className="text-lg font-semibold">배송지</h3>

            <div className="flex justify-between text-sm text-muted">
              <span>받는 분</span>
              <span>
                {" "}
                <input
                  type="text"
                  placeholder="받는 분 성함"
                  name="shippingName"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </span>
            </div>

            <div className="flex justify-between text-sm text-muted">
              <span>받는 분 휴대폰</span>
              <span>
                {" "}
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  name="shippingMobile"
                  value={shippingMobile}
                  onChange={(e) => setShippingMobile(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </span>
            </div>

            <div className="flex justify-between text-sm text-muted">
              <span className="w-full">
                <textarea
                  placeholder="받는 분 주소"
                  name="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-4 py-2 h-21 
                 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-soft p-5 space-y-3">
            <div id="payment-widget"></div>
            <button
              onClick={handleOrder}
              className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ff8a1e] transition"
            >
              결제 하기
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
