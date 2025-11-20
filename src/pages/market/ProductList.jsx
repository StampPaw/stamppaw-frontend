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

  // URL 파라미터에서 categoryKey 가져옴
  const initialSelectedKey = params.get("category"); // ex) CAP

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  /** 1) 카테고리 로딩 */
  useEffect(() => {
    fetchCategories();
  }, []);

  /** 2) 카테고리 로드 후 초기 선택 설정 */
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    // URL에 키가 있는 경우
    if (initialSelectedKey) {
      const found = categories.find((c) => c.value === initialSelectedKey);
      if (found) {
        setSelectedLabel(found.label);
        setSelectedKey(found.value);
        return;
      }
    }

    // URL 파라미터가 없거나 잘못된 경우 → 첫 번째 카테고리 선택
    const first = categories[0];
    if (first) {
      setSelectedLabel(first.label);
      setSelectedKey(first.value);
    }
  }, [categories]);

  /** 3) 태그 클릭 */
  const handleTagClick = (label) => {
    const found = categories.find((c) => c.label === label);
    if (found) {
      setSelectedLabel(found.label);
      setSelectedKey(found.value);
    }
  };

  /** 4) 선택된 categoryKey로 상품 로딩 */
  useEffect(() => {
    if (!selectedKey) return;
    fetchProductsByCategory(selectedKey);
  }, [selectedKey]);

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <CategoryTag
            tags={categories || []}
            selectedTag={selectedLabel}
            onTagClick={handleTagClick}
          />

          {selectedKey && (
            <ProductCardGrid
              products={categoryProducts || []}
              category={selectedLabel}
              categoryKey={selectedKey}
              page="products"
            />
          )}
        </main>
      </div>
    </div>
  );
}
