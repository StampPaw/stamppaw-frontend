import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePartTimeApplyPage() {
  const [applyList, setApplyList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const size = 5;
  const navigate = useNavigate();

  const statusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "ACCEPTED":
        return "수락됨";
      case "REJECTED":
        return "거절됨";
      default:
        return status;
    }
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "px-2 py-1 text-xs bg-[#FFF7E8] text-[#C08A2D] border border-[#F0D9A8] rounded-md";
      case "ACCEPTED":
        return "px-2 py-1 text-xs bg-[#EDFFF3] text-[#3C8C50] border border-[#C8EED5] rounded-md";
      case "REJECTED":
        return "px-2 py-1 text-xs bg-[#FFECEC] text-[#C14A4A] border border-[#F3C2C2] rounded-md";
      default:
        return "px-2 py-1 text-xs bg-gray-100 text-gray-600 border border-gray-300 rounded-md";
    }
  };

  const fetchApplyList = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/parttime/myApply?page=${page}&size=${size}`,        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("신청한 알바 불러오기 실패");

      const data = await res.json();

      setApplyList((prev) => {
        return page === 0 ? data.content : [...prev, ...data.content];
      });

      setHasNext(!data.last);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchApplyList();
  }, [fetchApplyList]);

  return (
    <div className="space-y-4 mt-3">
      {applyList.length === 0 && !loading && (
        <div className="text-center mt-10 text-[#8D8D8D]">
          아직 신청한 알바가 없어요 🐶💼
        </div>
      )}

      {applyList.map((item, idx) => {
        const p = item.partTimeDto;

        return (
          <div
            key={idx}
            onClick={() => navigate(`/parttime/${item.partTimeId}`)}
            className="p-5 bg-white rounded-2xl border border-[#E8DCC4] shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#4A3728]">{p.title}</h3>
            </div>

            <p className="text-sm text-[#7C6A59] leading-relaxed line-clamp-2 mt-2">
              {p.content}
            </p>

            <div className="border-t border-[#EFE7DA] pt-3 flex justify-between items-center mt-3">
              <span className={statusBadgeClass(item.status)}>
                {statusLabel(item.status)}
              </span>
            </div>
          </div>
        );
      })}

      {hasNext && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-full py-3 bg-gradient-to-r from-[#F7D9B5] to-[#F1C48A] rounded-xl text-[#4C3928] font-semibold shadow-sm hover:shadow-md transition"
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
