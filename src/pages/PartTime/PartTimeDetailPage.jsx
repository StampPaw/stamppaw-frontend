import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import UserAvatar from "../../components/ui/UserAvatar";
import UserProfileLink from "../../components/common/UserProfileLink";

// 애니메이션 스타일
<style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
`}</style>;

export default function PartTimeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parttime, setPartTime] = useState(null);

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isChatOngoing, setIsChatOngoing] = useState(false);
  const [existingRoomId, setExistingRoomId] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyList, setApplyList] = useState([]);

  const currentUserId = Number(JSON.parse(localStorage.getItem("user"))?.id);
  const appliedKey = `parttime_apply_${id}_${currentUserId}`;
  const [hasApplied, setHasApplied] = useState(false);

  // 로컬스토리지에 신청 여부
  useEffect(() => {
    const applied = localStorage.getItem(appliedKey);
    setHasApplied(applied === "true");
  }, [appliedKey]);

  // 상세 불러오기
  useEffect(() => {
    const fetchPartTime = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (!res.ok) throw new Error("데이터 불러오기 실패");
        const data = await res.json();
        setPartTime(data);
      } catch (error) {
        console.error("상세보기 불러오기 실패:", error);
      }
    };
    fetchPartTime();
  }, [id]);

  // 채팅방 존재 여부 확인
  useEffect(() => {
    const checkExistingChat = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/parttime/chat/rooms`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("채팅방 목록 불러오기 실패");
        const rooms = await res.json();

        const room = rooms.find((room) => room.partTimeId === Number(id));
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

  // 채팅 생성 또는 이동
  const handleChatStart = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/parttime/chat/rooms/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // 신청
  const handleApplyClick = async () => {
    if (hasApplied) {
      alert("이미 신청한 글입니다.");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.name === "ALREADY_APPLICANT") {
          alert("이미 신청한 글입니다.");
          setHasApplied(true);
          localStorage.setItem(appliedKey, "true");
          return;
        }
        throw new Error("신청 실패");
      }
      alert("알바 신청이 완료되었습니다.");
      setHasApplied(true);
      localStorage.setItem(appliedKey, "true");
    } catch (e) {
      console.error("알바 신청 실패:", e);
      alert("신청 중 오류가 발생했습니다.");
    }
  };

  // 신청 목록 모달 열면 리스트 불러오기
  useEffect(() => {
    if (showApplyModal && currentUserId === parttime?.user?.id) {
      const fetchApplyList = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}/apply/manage`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // 신청 상태 변경
  const handleStatusChange = async (applyId, newStatus) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}/apply/status/${applyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("상태 변경 실패");

      // 목록 다시 불러오기
      const updatedListRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}/apply/manage`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedData = await updatedListRes.json();
      setApplyList(updatedData.content || []);
    } catch (error) {
      console.error("상태 변경 오류:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 로딩 화면
  if (!parttime)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        불러오는 중...
      </div>
    );

  // 화면 렌더링
  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] flex flex-col relative mx-auto h-screen">
        {/* 헤더 */}
        <div className="sticky top-0 bg-[#FFF8EE] z-30 flex items-center gap-3 p-4 shadow-sm border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="text-gray-700" size={22} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            알바 상세보기
          </h2>
        </div>

        {/* 내용 */}
        <main className="flex-1 overflow-y-auto pb-28 bg-[#FFF8EE]">
          <div className="p-4">
            {!!parttime.image && parttime.image !== "" && (
              <img
                src={parttime.image}
                alt={parttime.title}
                className="w-full h-auto max-h-[600px] object-contain mb-5 rounded-md"
              />
            )}
          </div>

          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-100 p-4 mx-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-start justify-between gap-3">
              <span className="flex-1 break-words leading-snug">
                {parttime.title}
              </span>

              {/* 상태 변경 버튼 */}
              <div className="relative inline-flex shrink-0">
                <span
                  onClick={() => setShowStatusMenu((prev) => !prev)}
                  className={`text-sm font-semibold px-3 py-1 rounded-full cursor-pointer transition shadow-sm border
                    ${
                      parttime.status === "ONGOING"
                        ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                        : "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                    }
                  `}
                >
                  {parttime.status === "ONGOING" ? "모집 중" : "마감"}
                </span>

                {/* 상태 변경 메뉴 */}
                {showStatusMenu && currentUserId === parttime.user?.id && (
                  <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg border border-gray-200 rounded-xl z-50 overflow-hidden animate-fadeIn">
                    <button
                      onClick={async () => {
                        try {
                          const newStatus = "ONGOING";
                          const res = await fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                              body: JSON.stringify({ status: newStatus }),
                            }
                          );
                          if (!res.ok)
                            throw new Error("모집 상태 변경 실패");

                          setPartTime((prev) => ({
                            ...prev,
                            status: newStatus,
                          }));
                          setShowStatusMenu(false);
                        } catch (err) {
                          alert("상태 변경 실패");
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-gray-700 transition"
                    >
                      모집 중
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          const newStatus = "CLOSED";
                          const res = await fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                              body: JSON.stringify({ status: newStatus }),
                            }
                          );
                          if (!res.ok)
                            throw new Error("모집 상태 변경 실패");

                          setPartTime((prev) => ({
                            ...prev,
                            status: newStatus,
                          }));
                          setShowStatusMenu(false);
                        } catch (err) {
                          alert("상태 변경 실패");
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-gray-700 transition"
                    >
                      마감
                    </button>
                  </div>
                )}
              </div>
            </h1>

            {/* 작성자 + 버튼 세트 */}
            <div className="mb-4 flex flex-col gap-2 text-sm text-gray-500">
              <div className="flex items-center justify-between">
                <UserProfileLink userId={parttime.user?.id}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <UserAvatar image={parttime.user?.image} size="md" />
                    <span className="font-medium">
                      {parttime.user?.nickname || "익명"}
                    </span>
                  </div>
                </UserProfileLink>

                <div className="flex gap-2">
                  {currentUserId !== parttime.user?.id ? (
                    <>
                      {/* 채팅 */}
                      <button
                        onClick={handleChatButtonClick}
                        disabled={parttime.status === "CLOSED"}
                        className={`bg-orange-400 text-white text-xs px-3 py-1 rounded-full shadow-sm transition ${
                          parttime.status === "CLOSED"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "hover:bg-orange-500"
                        }`}
                      >
                        {isChatOngoing ? "대화 중" : "채팅"}
                      </button>

                      {/* 신청 */}
                      <button
                        onClick={handleApplyClick}
                        disabled={hasApplied || parttime.status === "CLOSED"}
                        className={`text-white text-xs px-3 py-1 rounded-full shadow-sm transition ${
                          hasApplied || parttime.status === "CLOSED"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-orange-400 hover:bg-orange-500"
                        }`}
                      >
                        {hasApplied
                          ? "신청 완료"
                          : parttime.status === "CLOSED"
                          ? "불가"
                          : "신청"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="text-white text-xs px-3 py-1 rounded-full shadow-sm transition bg-orange-300 hover:bg-indigo-400"
                    >
                      신청 목록
                    </button>
                  )}
                </div>
              </div>

              {/* 등록 날짜 */}
              <span>
                {new Date(parttime.registeredAt).toLocaleString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* 내용 */}
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {parttime.content}
            </p>

            {/* 수정/삭제 */}
            <div className="flex items-center gap-2 mt-3">
              {currentUserId === parttime.user?.id && (
                <>
                  <button
                    onClick={() => navigate(`/parttime/${id}/edit`)}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    onClick={async () => {
                      if (!window.confirm("정말 삭제하시겠습니까?")) return;
                      try {
                        const res = await fetch(
                          `${import.meta.env.VITE_API_BASE_URL}/parttime/${id}`,
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
                        navigate("/parttime");
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

      {/* 신청 목록 모달 */}
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
                          {apply.user?.nickname || "익명"}
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
