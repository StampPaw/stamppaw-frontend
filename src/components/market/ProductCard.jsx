import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBasket, Plus, Minus, ChevronLeft } from "lucide-react";
import { OptionTag } from "./OptionTag.jsx";
import useCartStore from "../../stores/useCartStore.js";

export default function ProductCard({ product }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const { cart, fetchCart, addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  //const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartItemCount = 0;
  const [userImage, setUserImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSelectOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUserImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddToCart = async () => {
    // 1) 옵션 선택 확인
    if (product.options?.length > 0) {
      const missing = product.options.filter(
        (opt) => !selectedOptions[opt.name]
      );

      if (missing.length > 0) {
        return alert(
          `옵션을 선택해주세요: ${missing.map((m) => m.name).join(", ")}`
        );
      }
    }

    // 2) optionSummary 생성
    const optionSummary = Object.entries(selectedOptions)
      .map(([key, value]) => `${key}:${value}`)
      .join("  / ");

    let uploadedUrl = "";

    // CLOTHING_GOODS라면 사진 선택 먼저 실행
    if (
      product.category === "CLOTHING_GOODS" ||
      product.category === "의류굿즈"
    ) {
      if (!userImage) {
        return alert(
          "해당 상품은 반려견 사진이 필요합니다.\n사진을 업로드해주세요!"
        );
      }
    }

    // 3) item 생성
    const item = {
      productId: product.id,
      optionSummary,
      price: Number(product.price),
      quantity: quantity,
      userImageFile: userImage ? userImage.name : null, // 이름만 저장
      file: userImage, // 주문 단계에서 업로드하기 위해 프론트에서 유지
    };

    console.log("장바구니 데이터:", item);

    try {
      await addToCart([item]);
      const goToCart = window.confirm(
        "장바구니에 추가되었습니다.\n장바구니를 확인 하시겠습니까?"
      );

      if (goToCart) {
        navigate("/market/cart");
      }
    } catch (e) {
      console.error("장바구니 추가 실패", e);
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="cursor-pointer" />
          </button>
          <span>{product.name}</span>
        </div>

        <span
          onClick={() => navigate(`/market/cart`)}
          className="relative inline-flex items-center justify-center 
            w-8 h-8 rounded-full bg-white shadow 
            cursor-pointer hover:bg-gray-50 transition"
        >
          <ShoppingBasket className="text-primary" />

          {cartItemCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white 
                text-[10px] font-bold w-4 h-4 flex items-center justify-center 
                rounded-full shadow"
            >
              {cartItemCount}
            </span>
          )}
        </span>
      </h2>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-border w-full">
        <div className="relative">
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
          <span className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {Math.floor(product.price).toLocaleString()}원
          </span>
        </div>

        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-lg text-text">{product.name}</h3>
          <span className="text-base font-semibold">
            {Math.floor(product.price).toLocaleString()}원
          </span>

          <p className="text-muted text-sm">{product.description}</p>

          <div className="space-y-3">
            {product.options?.map((opt) => (
              <div key={opt.id}>
                <p className="font-semibold text-sm mb-2">{opt.name}</p>
                <OptionTag
                  option={opt}
                  selected={selectedOptions[opt.name]}
                  onSelect={handleSelectOption}
                />
              </div>
            ))}
          </div>
          {product.category === "CLOTHING_GOODS" && (
            <div className="space-y-3">
              <p className="font-semibold text-sm mb-2">반려견 사진 업로드</p>
              <input
                id="dogImage"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label
                htmlFor="dogImage"
                className="inline-block bg-secondary px-4 py-2 rounded-lg border border-primary text-primary font-medium text-sm cursor-pointer hover:bg-primary hover:text-white transition"
              >
                사진 선택하기
              </label>
              {previewUrl && (
                <div className="w-full aspect-square overflow-hidden rounded-lg border border-primary">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            {cart?.items?.map((item) => (
              <div key={item.cartItemId}>
                {item.name} - {item.quantity}
                <button
                  onClick={() =>
                    updateQuantity(item.cartItemId, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button onClick={() => removeItem(item.cartItemId)}>
                  삭제
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2 font-semibold text-sm">
            수량
            <button
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-text">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ff8a1e] transition"
          >
            <Plus /> 장바구니에 추가하기
          </button>
        </div>
      </div>
    </section>
  );
}
