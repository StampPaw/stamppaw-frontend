import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CategoryTag from "../../components/market/CategoryTag";
import ProductCardGrid from "../../components/market/ProductCardGrid";
import useMarketStore from "../../stores/useMarketStore";

export default function ProductList() {
  const { categories, fetchCategories } = useMarketStore();
  const { categoryProducts, fetchProductsByCategory } = useMarketStore();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") || "ALL";

  const [selectedTag, setSelectedTag] = useState(initialCategory);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const found = categories.find((c) => c.label === initialCategory);

    if (found) {
      setSelectedTag(found.value);
    } else {
      setSelectedTag("ALL");
    }
  }, [categories, initialCategory]);

  useEffect(() => {
    if (selectedTag === "ALL") return;
    fetchProductsByCategory(selectedTag);
  }, [selectedTag]);

  console.log("⭐ categories:", categories);
  //console.log("⭐ categoryProducts:", categoryProducts);

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <CategoryTag
            tags={[{ value: "ALL", label: "전체" }, ...(categories || [])]}
            selectedTag={selectedTag}
            onTagClick={setSelectedTag}
          />
        </main>
      </div>
    </div>
  );
}
