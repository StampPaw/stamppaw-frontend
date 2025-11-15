import { useState, useEffect, useCallback } from "react";
import ProfileAccompanyPage from "./ProfileAccompanyPage";
import ProfileApplyPage from "./ProfileApplyPage";

export default function ProfileAccompanyManagePage() {
  const [tab, setTab] = useState("companion");

  return (
    <div className="mt-5">
      <div className="flex gap-5 border-b border-[#cbcbcb] pb-2 mb-5">
        <button
          onClick={() => setTab("companion")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "companion"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          작성한 동행글
        </button>

        <button
          onClick={() => setTab("apply")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "apply"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          신청한 동행
        </button>

        <button
          onClick={() => setTab("send")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "send"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          작성한 리뷰
        </button>

        <button
          onClick={() => setTab("receive")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "receive"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          받은 리뷰
        </button>
      </div>

      <div className="mt-3">
        {tab === "companion" && <ProfileAccompanyPage />}
        {tab === "apply" && <ProfileApplyPage />}
        {tab === "send" && <ReviewList type="send" />}
        {tab === "receive" && <ReviewList type="receive" />}
      </div>
    </div>
  );
}

function ReviewList({ type }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const size = 5;

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);

      const url =
        type === "send"
          ? `/api/companion/review/send?page=${page}&size=${size}`
          : `/api/companion/review/receive?page=${page}&size=${size}`;

      const res = await fetch(`http://localhost:8080${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      setReviews((prev) => {
        const merged = [...prev, ...data.content];

        const unique = merged.filter(
          (item, idx, arr) =>
            idx ===
            arr.findIndex(
              (v) =>
                v.title === item.title &&
                v.user.nickname === item.user.nickname &&
                JSON.stringify(v.tags) === JSON.stringify(item.tags)
            )
        );
        return unique;
      });

      setHasNext(!data.last);
    } finally {
      setLoading(false);
    }
  }, [page, type]);

  useEffect(() => {
    setReviews([]);
    setPage(0);
    setHasNext(true);
  }, [type]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="space-y-4">
      {reviews.map((item, idx) => (
        <div
          key={`${item.title}-${item.user.nickname}-${idx}`}
          className="p-5 bg-[#FFFCF7] border border-[#E6D5BD] rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#4C3928]">{item.title}</h3>
            <p className="text-sm text-[#A17C52] font-medium">
              {item.user.nickname}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="px-3 py-1 bg-[#FFECC7] text-[#6E4D28] rounded-full text-xs border border-[#E3C89D]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      {hasNext && !loading && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-full py-3 bg-gradient-to-r from-[#F7D9B5] to-[#F1C48A] rounded-xl text-[#4C3928] font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        >
          더 보기
        </button>
      )}

      {loading && (
        <p className="text-center text-[#A17C52] text-sm">불러오는 중...</p>
      )}
    </div>
  );
}
