import { useEffect, useState, useRef } from "react";

export default function CompanionReviewPage() {
  const [tab, setTab] = useState("send");
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const size = 5;

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const url =
        tab === "send"
          ? `/api/companion/review/send?page=${page}&size=${size}`
          : `/api/companion/review/receive?page=${page}&size=${size}`;

      const res = await fetch(`http://localhost:8080${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("리뷰 불러오기 실패");

      const data = await res.json();

      setReviews((prev) => [...prev, ...data.content]);
      setHasNext(!data.last);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 탭 바뀔 때 초기화
  useEffect(() => {
    setReviews([]);
    setPage(0);
    setHasNext(true);
  }, [tab]);

  // page 또는 tab 변화 → fetch 실행
  useEffect(() => {
    fetchReviews();
  }, [page, tab]);

  return (
    <div className="p-5">
      {/* 탭 버튼 */}
      <div className="flex gap-5 border-b pb-2 mb-5">
        <button
          onClick={() => setTab("send")}
          className={`pb-2 ${
            tab === "send"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500"
          }`}
        >
          내가 작성한 리뷰
        </button>

        <button
          onClick={() => setTab("receive")}
          className={`pb-2 ${
            tab === "receive"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500"
          }`}
        >
          내가 받은 리뷰
        </button>
      </div>

      {/* 리뷰 목록 */}
      {reviews.map((item, idx) => (
        <div
          key={`${item.title}-${item.user.nickName}-${idx}`}
          className="p-5 mb-4 bg-white rounded-xl shadow-sm border border-[#F3E9D7] hover:shadow-md transition-shadow"
        >
          {/* 제목 */}
          <h3 className="text-lg font-bold text-[#4C3928]">{item.title}</h3>
          {/* 프로필 + 닉네임 */}
          <div className="flex items-center gap-3 mt-3">
            <div>
              <p className="text-sm text-[#4C3928] font-semibold">
                {item.user?.nickName ?? "알 수 없음"}
              </p>
            </div>
          </div>
          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mt-3">
            {item.tags?.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="px-3 py-1 bg-[#FFF1CC] text-[#6E4D28] text-xs rounded-full border border-[#E4C99B]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* 더 보기 */}
      {hasNext && !loading && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-full py-3 bg-[#F5E4C5] text-[#6E4D28] rounded-lg"
        >
          더 보기
        </button>
      )}

      {loading && <p className="text-center mt-3">불러오는 중...</p>}
    </div>
  );
}
