import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import UserAvatar from "../../components/ui/UserAvatar";
import UserProfileLink from "../../components/common/UserProfileLink";

<style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
`}</style>;

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);

  const currentUserId = Number(JSON.parse(localStorage.getItem("user"))?.id);

  // ✅ 글 상세 불러오기
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/community/${id}`
        );
        if (!res.ok) throw new Error("데이터 불러오기 실패");
        const data = await res.json();
        setCommunity(data);
      } catch (error) {
        console.error("상세보기 불러오기 실패:", error);
      }
    };
    fetchCommunity();
  }, [id]);

  if (!community)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        불러오는 중...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] flex flex-col relative mx-auto h-screen">
        <div className="sticky top-0 bg-[#FFF8EE] z-30 flex items-center gap-3 p-4 shadow-sm border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="text-gray-700" size={22} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            동행 글 상세보기
          </h2>
        </div>

        <main className="flex-1 overflow-y-auto pb-28 bg-[#FFF8EE]">
          <div className="p-4">
            {community.image && (
              <img
                src={community.image}
                alt={community.title}
                className="w-full h-auto max-h-[600px] object-contain mb-5 rounded-md"
              />
            )}
          </div>

          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-100 p-4 mx-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-start justify-between gap-3">
              {/* 제목은 왼쪽에서만 줄바꿈되도록 */}
              <span className="flex-1 break-words leading-snug">
                {community.title}
              </span>
            </h1>

            <div className="mb-4 flex flex-col gap-2 text-sm text-gray-500">
              {/* 첫 줄: 작성자 + 버튼들 */}
              <div className="flex items-center justify-between">
                <UserProfileLink userId={community.user?.id}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <UserAvatar image={community.user?.image} size="md" />
                    <span className="font-medium">
                      {community.user?.nickname || "익명"}
                    </span>
                  </div>
                </UserProfileLink>
              </div>

              {/* 두 번째 줄: 등록 날짜 */}
              <span>
                {new Date(community.registeredAt).toLocaleString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {community.content}
            </p>

            <div className="flex items-center gap-2 mt-3">
              {currentUserId === community.user?.id && (
                <>
                  <button
                    onClick={() => navigate(`/community/edit/${id}`)}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    onClick={async () => {
                      if (!window.confirm("정말 삭제하시겠습니까?")) return;
                      try {
                        const res = await fetch(
                          `${
                            import.meta.env.VITE_API_BASE_URL
                          }/community/${id}`,
                          {
                            method: "DELETE",
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );
                        if (!res.ok) throw new Error("삭제 실패");
                        alert("삭제가 완료되었습니다.");
                        navigate("/community");
                      } catch (error) {
                        console.error("삭제 오류:", error);
                        alert("삭제 중 문제가 발생했습니다.");
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Trash size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
