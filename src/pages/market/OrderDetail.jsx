import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import React, { useEffect, useState } from "react";
import useOrderStore from "../../stores/useOrderStore.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-5">
          <h2 className="flex items-center justify-between text-xl font-semibold mb-4 w-full">
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)}>
                <ChevronLeft className="cursor-pointer" />
              </button>
              주문 상세보기
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

            <div className="flex flex-col w-full gap-2">
              <label className="text-sm text-muted">주소 검색</label>

              <textarea
                placeholder="상세 주소를 입력하세요"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-4 py-2 h-21 
               placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
