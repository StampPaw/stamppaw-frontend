import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWalkStore } from "../../stores/useWalkStore";

export default function WalkListPage({ userId: propUserId }) {
  const params = useParams();
  
  // ⭐ 최종 userId 결정 (props > URL Params)
  const finalUserId = propUserId ?? params.userId;

  // ⭐ userId가 없으면 "내 프로필"로 간주
  const isMyProfile = !finalUserId;

  const {
    walkList,
    fetchMyWalks,
    fetchWalksByUser,
    resetWalkList,
    currentPage,
    isLoading,
    isLastPage,
  } = useWalkStore();

  const observerRef = useRef(null);
  const navigate = useNavigate();

  // ==========================
  // 🚀 1. 초기 로드
  // ==========================
  useEffect(() => {
    resetWalkList();

    if (isMyProfile) {
      // 내 산책 목록
      fetchMyWalks(0, 12, false);
    } else {
      // 다른 유저 산책 목록
      fetchWalksByUser(finalUserId, 0, 12, false);
    }
  }, [finalUserId]); // ⭐ finalUserId 가 변경되면 리스트 다시 불러오기

  // ==========================
  // ♾️ 2. 무한 스크롤 처리
  // ==========================
  useEffect(() => {
    if (isLoading || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = currentPage + 1;

          if (isMyProfile) {
            fetchMyWalks(nextPage, 12, true);
          } else {
            fetchWalksByUser(finalUserId, nextPage, 12, true);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [currentPage, isLoading, isLastPage, finalUserId]);

  return (
    <>
      {/* 🔹 썸네일 리스트 */}
      <div className="grid grid-cols-2 gap-3">
        {walkList.map((walk, idx) => {
          const thumb = walk.photoUrls?.[0] || "/walk/walk-thumbnail.png";

          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-soft overflow-hidden border border-border cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate(`/walk/${walk.id}`)}
            >
              <img
                src={thumb}
                alt="walk-thumbnail"
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <p className="font-semibold text-base text-text line-clamp-1">
                  {walk.memo || "메모 없음"}
                </p>
                <p className="text-muted text-sm">
                  {new Date(walk.startTime).toLocaleDateString()}{" "}
                  {new Date(walk.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔽 무한 스크롤 감지 */}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {isLoading && <p className="text-gray-500 text-sm">로딩 중...</p>}
        {isLastPage && (
          <p className="text-gray-400 text-sm">모두 불러왔어요 🐶</p>
        )}
      </div>
    </>
  );
}
