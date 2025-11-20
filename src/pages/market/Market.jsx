import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, ShoppingBasket } from "lucide-react";
import LatestCarousel from "../../components/market/LatestCarousel";
import ProductCardGrid from "../../components/market/ProductCardGrid";
import useMarketStore from "../../stores/useMarketStore";

export default function Market() {
  const {
    latestMainImages,
    fetchLatestMainImages,
    loading,
    categoryProductsAll,
    fetchProductsAllCategory,
    categories,
    fetchCategories,
  } = useMarketStore();

  useEffect(() => {
    fetchLatestMainImages();
  }, []);

  useEffect(() => {
    fetchProductsAllCategory();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("📦 Market categories:", categories);
  }, [categories]);

  //console.log("⭐Market latestMainImages:", latestMainImages);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-1">
          <div className="flex justify-end gap-2">
            <Link
              to="/market/orders"
              className="group p-1 rounded-xl hover:bg-primary/20 cursor-pointer transition"
            >
              <ShoppingBag
                strokeWidth={2.5}
                className="text-primary group-hover:text-primary/80 transition"
              />
            </Link>

            <Link
              to="/market/cart"
              className="group p-1 rounded-xl hover:bg-primary/20 cursor-pointer transition"
            >
              <ShoppingBasket
                strokeWidth={2.5}
                className="text-primary group-hover:text-primary/80 transition"
              />
            </Link>
          </div>

          <LatestCarousel
            images={(latestMainImages || []).map((p) => p.mainImageUrl)}
            products={(latestMainImages || []).map((p) => p.id)}
          />
          {categories.map((cat) => {
            const products = categoryProductsAll?.[cat.label] || [];

            return (
              <ProductCardGrid
                key={cat.value}
                products={products}
                category={cat.label}
                categoryKey={cat.value}
                page="market"
              />
            );
          })}
        </main>
      </div>
    </div>
  );
}
