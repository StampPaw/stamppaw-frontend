import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import CardGrid from "../components/ui/CardGrid";
import SearchBar from "../components/ui/SearchBar";
import LatestCarousel from "../components/market/LatestCarousel";
import useMarketStore from "../stores/useMarketStore";

export default function Market() {
  const { latestMainImages, fetchLatestMainImages, loading } = useMarketStore();

  useEffect(() => {
    fetchLatestMainImages();
  }, []);

  console.log("Market latestMainImages:", latestMainImages);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <SearchBar />
          <LatestCarousel images={latestMainImages || []} />
          <CardGrid />
        </main>
      </div>
    </div>
  );
}
