// ProductList.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CategoryTag from "../../components/market/CategoryTag";
import ProductCardGrid from "../../components/market/ProductCardGrid";
import useMarketStore from "../../stores/useMarketStore";

export default function ProductList() {
  const {
    categories,
    fetchCategories,
    categoryProducts,
    fetchProductsByCategory,
  } = useMarketStore();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCategoryLabel = params.get("category") || "전체";

  const [selectedLabel, setSelectedLabel] = useState(initialCategoryLabel);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (initialCategoryLabel === "전체") {
      setSelectedLabel("전체");
      setSelectedKey(null);
      return;
    }

    const found = categories.find((c) => c.label === initialCategoryLabel);

    if (found) {
      setSelectedLabel(found.label); // 예: "모자"
      setSelectedKey(found.value); // 예: "CAP"
    } else {
      setSelectedLabel("전체");
      setSelectedKey(null);
    }
  }, [categories, initialCategoryLabel]);

  const handleTagClick = (label) => {
    setSelectedLabel(label);

    if (label === "전체") {
      setSelectedKey(null);
      return;
    }

    const found = categories.find((c) => c.label === label);
    setSelectedKey(found ? found.value : null);
  };

  useEffect(() => {
    if (!selectedKey) return;
    fetchProductsByCategory(selectedKey);
  }, [selectedKey]);

  //console.log("⭐ selectedLabel:", selectedLabel);
  console.log("⭐ selectedKey:", selectedKey);
  //console.log("⭐ categoryProducts:", categoryProducts);

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <CategoryTag
            //tags={[{ value: "ALL", label: "전체" }, ...(categories || [])]}
            tags={categories || []}
            selectedTag={selectedLabel}
            onTagClick={handleTagClick}
          />

          {/* 선택된 카테고리 상품 */}
          {selectedKey && (
            <ProductCardGrid
              products={categoryProducts || []}
              category={selectedLabel}
              page="products"
            />
          )}
        </main>
      </div>
    </div>
  );
}
