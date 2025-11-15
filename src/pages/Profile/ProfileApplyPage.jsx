import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileApplyPage() {
  const [applyList, setApplyList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const size = 5;
  const navigate = useNavigate();

  // 신청 상태 라벨 변환
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
        return `
          flex items-center gap-1.5 
          px-2.5 py-[3px] rounded-md text-xs font-medium
          bg-[#FFF7E8] text-[#C08A2D] border border-[#F0D9A8]
        `;
      case "ACCEPTED":
        return `
          flex items-center gap-1.5 
          px-2.5 py-[3px] rounded-md text-xs font-medium
          bg-[#EDFFF3] text-[#3C8C50] border border-[#C8EED5]
        `;
      case "REJECTED":
        return `
          flex items-center gap-1.5 
          px-2.5 py-[3px] rounded-md text-xs font-medium
          bg-[#FFECEC] text-[#C14A4A] border border-[#F3C2C2]
        `;
      default:
        return `
          flex items-center gap-1.5 
          px-2.5 py-[3px] rounded-md text-xs font-medium
          bg-gray-100 text-gray-600 border border-gray-300
        `;
    }
  };

  const fetchApplyList = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/companion/myApply?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("신청한 요청 불러오기 실패");

      const data = await res.json();

      setApplyList((prev) => {
        // ⭐ page == 0이면 새로운 데이터로 교체
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

  if (!loading && applyList.length === 0) {
    return (
      <div className="text-center mt-10 text-[#8D8D8D]">
        아직 신청한 동행이 없어요 🐾
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-3">
      {applyList.map((item, idx) => {
        const c = item.companionDto;

        return (
          <div
            key={idx}
            onClick={() => navigate(`/companion/${c.id}`)}
            className="
              p-5 bg-white rounded-2xl border border-[#E8DCC4]
              shadow-[0_4px_12px_rgba(0,0,0,0.04)]
              hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]
              transition-all duration-300 cursor-pointer
            "
          >
            <div className="flex flex-col gap-3">
              {/* 제목 + 상태 */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#4A3728]">{c.title}</h3>

                <p className="text-[11px] font-semibold text-[#A76A26]">
                  {c.status === "ONGOING" ? "모집중" : "마감"}
                </p>
              </div>

              {/* 내용 미리보기 */}
              <p className="text-sm text-[#7C6A59] leading-relaxed line-clamp-2">
                {c.content}
              </p>

              {/* 하단 구분선 */}
              <div className="border-t border-[#EFE7DA] pt-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-[#A1866D]">
                  <span className="w-1.5 h-1.5 bg-[#D6B893] rounded-full" />
                  신청 상태
                </div>

                <span className={statusBadgeClass(item.status)}>
                  <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                  {statusLabel(item.status)}
                </span>
                {item.status === "ACCEPTED" &&
                  (item.reviewWritten ? (
                    <p className="text-xs text-[#A1866D] ml-3">
                      이미 리뷰를 작성하셨습니다
                    </p>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/companion/review/write/${item.companionDto.id}`
                        );
                      }}
                      className="
                        ml-3 px-3 py-1 rounded-md text-xs font-medium
                        bg-[#FFEFD6] text-[#A76A26] border border-[#F2D8A4]
                        hover:bg-[#FFE3BB] transition
                      "
                    >
                      리뷰 작성하기
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      })}

      {hasNext && (
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
