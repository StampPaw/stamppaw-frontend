import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";
import UserAvatar from "../components/ui/UserAvatar";

export default function ChatListPage() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("동행");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) return;

    let intervalId;

    const fetchChatRooms = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/companion/chat/rooms",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("채팅방 목록 불러오기 실패");
        const data = await res.json();
        setChatRooms(data);
      } catch (e) {
        console.error(e);
      }
    };

    if (activeTab === "동행") {
      // ✅ 처음 들어올 때 한 번
      fetchChatRooms();
      intervalId = setInterval(fetchChatRooms, 1000);
    } else if (activeTab === "아르바이트") {
      setChatRooms([]);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, activeTab]);

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] flex flex-col relative mx-auto h-screen">
        {/* 상단 탭 */}
        <div className="sticky top-0 bg-[#FFF8EE] z-30 flex flex-col gap-3 p-4 shadow-sm border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">내 채팅방</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("동행")}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                activeTab === "동행"
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              동행
            </button>
            <button
              onClick={() => setActiveTab("아르바이트")}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                activeTab === "아르바이트"
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              아르바이트
            </button>
          </div>
        </div>

        {/* 채팅방 목록 */}
        <main className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-[#FFF8EE]">
          {activeTab === "아르바이트" ? (
            <p className="text-center text-gray-500 mt-10">
              아르바이트 채팅방 기능은 준비 중입니다.
            </p>
          ) : chatRooms.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              참여 중인 채팅방이 없습니다.
            </p>
          ) : (
            chatRooms.map((room) => {
              const otherUser = room.participants?.find(
                (p) => p.id !== currentUser?.id
              );

              const truncateMessage = (message, maxLength = 15) => {
                if (!message) return "아직 메시지가 없습니다.";
                return message.length > maxLength
                  ? message.slice(0, maxLength) + "..."
                  : message;
              };

              return (
                <div
                  key={room.id}
                  onClick={() => navigate(`/chat/${room.id}`)}
                  className="bg-white shadow-sm rounded-xl p-4 cursor-pointer hover:bg-stone-50 transition border border-gray-100 flex items-center gap-4"
                >
                  <div className="flex flex-col items-start justify-start w-16">
                    <UserAvatar
                      image={otherUser?.profileImage}
                      alt={otherUser?.nickname}
                      size="md"
                    />
                    <span className="text-xs text-gray-500 mt-1 truncate w-full text-left">
                      {otherUser?.nickname || otherUser?.email || "알 수 없음"}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 pl-2">
                    <h3 className="font-semibold text-gray-800 text-base truncate">
                      {room.name || room.companionTitle}
                    </h3>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {truncateMessage(room.lastMessageContent)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end ml-auto">
                    <span className="text-[11px] text-gray-400">
                      {room.lastMessageTime
                        ? new Date(room.lastMessageTime).toLocaleTimeString(
                            "ko-KR",
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : ""}
                    </span>
                    {(() => {
                      const lastReadAt = localStorage.getItem(
                        `lastReadAt_room_${room.id}`
                      );

                      const isUnread =
                        room.lastMessageTime &&
                        room.lastMessageSenderId && // sender 정보가 있을 때만
                        room.lastMessageSenderId !== currentUser?.id && // ✅ 내가 보낸 메시지는 제외
                        (!lastReadAt ||
                          new Date(room.lastMessageTime) >
                            new Date(lastReadAt));

                      return (
                        isUnread && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                        )
                      );
                    })()}
                  </div>
                </div>
              );
            })
          )}
        </main>

        <nav className="sticky bottom-0 w-full shadow-lg bg-[#FFF8EE] border-t border-gray-200">
          <NavBar />
        </nav>
      </div>
    </div>
  );
}
