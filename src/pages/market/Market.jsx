import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LatestCarousel from "../../components/market/LatestCarousel";
import ProductCardGrid from "../../components/market/ProductCardGrid";
import useMarketStore from "../../stores/useMarketStore";

export default function Market() {
  const { latestMainImages, fetchLatestMainImages, loading } = useMarketStore();
  const { categoryProductsAll, fetchProductsAllCategory } = useMarketStore();

  useEffect(() => {
    fetchLatestMainImages();
  }, []);

  useEffect(() => {
    fetchProductsAllCategory();
  }, []);

  //console.log("⭐Market latestMainImages:", latestMainImages);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <LatestCarousel
            images={(latestMainImages || []).map((p) => p.mainImageUrl)}
            products={(latestMainImages || []).map((p) => p.id)}
          />
          {Object.entries(categoryProductsAll || {}).map(
            ([categoryKey, products]) => (
              <ProductCardGrid
                key={categoryKey}
                products={products}
                category={categoryKey}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
}
