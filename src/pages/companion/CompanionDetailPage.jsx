import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserAvatar from "../../components/ui/UserAvatar";

export default function CompanionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companion, setCompanion] = useState(null);
  const [isChatOngoing, setIsChatOngoing] = useState(false);
  const [existingRoomId, setExistingRoomId] = useState(null);

  // ✅ 글 상세 불러오기
  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/companion/${id}`);
        if (!res.ok) throw new Error("데이터 불러오기 실패");
        const data = await res.json();
        setCompanion(data);
      } catch (error) {
        console.error("상세보기 불러오기 실패:", error);
      }
    };
    fetchCompanion();
  }, [id]);

  // ✅ 이미 채팅방이 존재하는지 확인
  useEffect(() => {
    const checkExistingChat = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/companion/chat/rooms",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("채팅방 목록 불러오기 실패");
        const rooms = await res.json();

        // 현재 글(companionId)과 일치하는 채팅방이 있는지 확인
        const room = rooms.find((room) => room.companionId === Number(id));
        if (room) {
          setIsChatOngoing(true);
          setExistingRoomId(room.id);
        } else {
          setIsChatOngoing(false);
          setExistingRoomId(null);
        }
      } catch (error) {
        console.error("채팅방 목록 확인 실패:", error);
      }
    };

    checkExistingChat();
  }, [id]);

  // ✅ 채팅 시작
  const handleChatStart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/companion/chat/rooms/companions/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error(`요청 실패: ${response.status}`);
      const data = await response.json();
      navigate(`/chat/${data.id}`);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  };

  const handleChatButtonClick = () => {
    if (isChatOngoing && existingRoomId) {
      navigate(`/chat/${existingRoomId}`);
    } else {
      handleChatStart();
    }
  };

  if (!companion)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        불러오는 중...
      </div>
    );

  const currentUserId = Number(JSON.parse(localStorage.getItem("user"))?.id);

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
            {companion.image && (
              <img
                src={companion.image}
                alt={companion.title}
                className="w-full h-auto max-h-[600px] object-contain mb-5 rounded-md"
              />
            )}
          </div>

          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-100 p-4 mx-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {companion.title}
            </h1>

            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <UserAvatar image={companion.user?.profileImage} size="md" />
                <span className="font-medium">
                  {companion.user?.nickName || "익명"}
                </span>

                {/* ✅ 본인 글이면 버튼 숨김 / 이미 대화중이면 '대화중인 채팅' 버튼 */}
                {currentUserId !== companion.user?.id ? (
                  <button
                    onClick={handleChatButtonClick}
                    className={`ml-2 text-white text-xs px-3 py-1 rounded-full shadow-sm transition ${
                      isChatOngoing
                        ? "bg-green-400 hover:bg-green-500 cursor-pointer"
                        : "bg-orange-400 hover:bg-orange-500"
                    }`}
                  >
                    대화중인 채팅
                  </button>
                ) : (
                  <span className="ml-2 text-xs text-gray-400">
                    내가 작성한 글
                  </span>
                )}
              </div>
              <span>{new Date(companion.registeredAt).toLocaleString()}</span>
            </div>

            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {companion.content}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
