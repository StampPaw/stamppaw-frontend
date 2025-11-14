import React, { useState, useEffect } from "react";
import CategoryTag from "../../components/market/CategoryTag";
import ProductCardGrid from "../../components/market/ProductCardGrid";
import useMarketStore from "../../stores/useMarketStore";

export default function ProductList() {
  const { categories, fetchCategories } = useMarketStore();
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  //console.log("⭐ categories:", categories);

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <CategoryTag
            tags={[{ value: "ALL", label: "전체" }, ...categories]}
            selectedTag={selectedTag}
            onTagClick={setSelectedTag}
          />
        </main>
      </div>
    </div>
  );
}
