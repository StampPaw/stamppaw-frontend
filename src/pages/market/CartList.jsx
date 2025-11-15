import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CartCard from "../../components/market/CartCard.jsx";

export default function CartList() {
  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <CartCard />
        </main>
      </div>
    </div>
  );
}
