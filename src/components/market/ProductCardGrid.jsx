import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";

export default function CardGrid({ products, category, categoryKey, page }) {
  const navigate = useNavigate();

  return (
    <section>
      {page === "market" && (
        <h2 className="text-xl font-semibold mb-2 mt-4 flex justify-between items-center">
          {category}

          <span
            className="text-xs text-primary cursor-pointer"
            onClick={() =>
              navigate(
                `/market/products?category=${encodeURIComponent(categoryKey)}`
              )
            }
          >
            더보기
          </span>
        </h2>
      )}
      {/* ✅ 반응형 1~2열 그리드 */}
      <div className="grid grid-cols-2 gap-5">
        {products.map((post) => (
          <Link
            key={post.id}
            to={`/market/product/${post.id}`}
            className="bg-white rounded-xl shadow-soft overflow-hidden border border-border cursor-pointer hover:shadow-md transition-all"
          >
            {/* 이미지 */}
            <div className="relative">
              <img
                src={post.mainImageUrl}
                alt={post.name}
                className="w-full aspect-4/3 object-cover"
              />
              <span className="absolute top-2 left-2 bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {Math.floor(post.price).toLocaleString()}원
              </span>
            </div>

            {/* 본문 */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-base text-text line-clamp-1 flex justify-between items-center">
                {post.name}

                <button
                  className="flex items-center gap-1 rounded-lg transition hover:bg-primary/30 group"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/market/cart?productId=${post.id}`);
                  }}
                >
                  {/*<ShoppingBasket className="text-primary transition group-hover:text-primary/80" />*/}
                </button>
              </h3>
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
