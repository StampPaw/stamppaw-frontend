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
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyList, setApplyList] = useState([]);

  const currentUserId = Number(JSON.parse(localStorage.getItem("user"))?.id);
  const appliedKey = `companion_apply_${id}_${currentUserId}`;
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const applied = localStorage.getItem(appliedKey);
    setHasApplied(applied === "true");
  }, [appliedKey]);

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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // 신청 목록 모달용 신청자 목록 불러오기
  useEffect(() => {
    if (showApplyModal && currentUserId === companion?.user?.id) {
      const fetchApplyList = async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/companion/${id}/apply/manage`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (!res.ok) throw new Error("신청 목록 불러오기 실패");
          const data = await res.json();
          setApplyList(data.content || []);
        } catch (e) {
          console.error("신청 목록 로드 실패:", e);
        }
      };
      fetchApplyList();
    }
  }, [showApplyModal]);

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

  const handleApplyClick = async () => {
    if (hasApplied) {
      alert("이미 신청한 글입니다.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/companion/${id}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errorCode === "ALREADY_APPLICANT") {
          alert("이미 신청한 글입니다.");
          setHasApplied(true);
          localStorage.setItem(appliedKey, "true");
          return;
        }
        throw new Error("신청 실패");
      }
      alert("동행 신청이 완료되었습니다.");
      setHasApplied(true);
      localStorage.setItem(appliedKey, "true");
    } catch (e) {
      console.error("동행 신청 실패:", e);
      alert("신청 중 오류가 발생했습니다.");
    }
  };

  const handleStatusChange = async (applyId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/companion/${id}/apply/status/${applyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("상태 변경 실패");
      // Refresh apply list after status update
      const updatedListRes = await fetch(
        `http://localhost:8080/api/companion/${id}/apply/manage`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!updatedListRes.ok) throw new Error("신청 목록 불러오기 실패");
      const updatedData = await updatedListRes.json();
      setApplyList(updatedData.content || []);
    } catch (error) {
      console.error("상태 변경 중 오류 발생:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  if (!companion)
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
            {companion.image && (
              <img
                src={companion.image}
                alt={companion.title}
                className="w-full h-auto max-h-[600px] object-contain mb-5 rounded-md"
              />
            )}
          </div>

          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-100 p-4 mx-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              {companion.title}
              {/* 모집 상태 표시 */}
              <div className="inline-block align-middle ml-2">
                {(() => {
                  const statusLabel =
                    {
                      ONGOING: "모집 중",
                      CLOSED: "모집 완료",
                    }[companion.status] || companion.status;
                  return (
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        companion.status === "ONGOING"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  );
                })()}
              </div>
            </h1>

            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <UserAvatar image={companion.user?.profileImage} size="md" />
                <span className="font-medium">
                  {companion.user?.nickName || "익명"}
                </span>

                {currentUserId !== companion.user?.id && (
                  <button
                    onClick={handleChatButtonClick}
                    className="bg-orange-400 hover:bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-sm transition"
                  >
                    {isChatOngoing ? "대화 중인 채팅" : "채팅하기"}
                  </button>
                )}

                {currentUserId !== companion.user?.id ? (
                  <>
                    <button
                      onClick={handleApplyClick}
                      disabled={hasApplied}
                      className={`ml-2 text-white text-xs px-3 py-1 rounded-full shadow-sm transition ${
                        hasApplied
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-400 hover:bg-orange-500"
                      }`}
                    >
                      {hasApplied ? "이미 신청한 글" : "동행 신청하기"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="ml-2 text-white text-xs px-3 py-1 rounded-full shadow-sm transition bg-green-500 hover:bg-green-600"
                    >
                      신청 목록 보기
                    </button>
                  </>
                )}
              </div>
              <span>
                {new Date(companion.registeredAt).toLocaleString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {companion.content}
            </p>

            <div className="flex items-center gap-2 mt-3">
              {/* Removed duplicate chat and apply buttons here */}
            </div>
          </div>
        </main>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transition">
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-3">신청 목록</h3>
            {applyList.length > 0 ? (
              <ul className="space-y-2">
                {applyList.map((apply) => {
                  const statusLabel =
                    {
                      PENDING: "신청 중",
                      ACCEPTED: "수락",
                      REJECTED: "거부",
                    }[apply.status] || apply.status;
                  return (
                    <li
                      key={apply.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {apply.user?.nickName || "익명"}
                        </p>
                        <p className="text-xs text-gray-500">{statusLabel}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(apply.id, "ACCEPTED")
                          }
                          className={`text-white text-xs px-3 py-1 rounded-full shadow-sm transition ${
                            apply.status === "ACCEPTED"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-400 hover:bg-gray-500"
                          }`}
                        >
                          수락
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(apply.id, "REJECTED")
                          }
                          className={`text-white text-xs px-3 py-1 rounded-full shadow-sm transition ${
                            apply.status === "REJECTED"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-gray-400 hover:bg-gray-500"
                          }`}
                        >
                          거절
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">아직 신청이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
