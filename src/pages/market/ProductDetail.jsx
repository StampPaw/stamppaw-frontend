import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMarketStore from "../../stores/useMarketStore";
import ProductCard from "../../components/market/ProductCard";

export default function ProductDetail() {
  const { productId } = useParams();
  const { productDetail, fetchProductDetail, loading } = useMarketStore();

  useEffect(() => {
    if (productId) fetchProductDetail(productId);
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (!productDetail) return <p>상품 정보를 불러오지 못했습니다.</p>;

  return (
    <div className="bg-white text-text font-sans">
      <div className="w-full sm:max-w-[500px] bg-bg flex flex-col relative mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 p-5 space-y-10">
          <ProductCard product={productDetail} />
        </main>
      </div>
    </div>
  );
}
