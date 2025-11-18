import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../../components/ui/Header";

export default function ChatRoomPage() {
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const { roomId } = useParams();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = user?.id || 0;
  const token = localStorage.getItem("token");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/companion/chat/messages/rooms/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.content.reverse()); // 오래된 메시지부터
        }
      } catch (e) {
        console.error("이전 메시지 불러오기 실패:", e);
      }
    };

    fetchMessages();

    const client = new Client({
      brokerURL: `ws://localhost:8080/ws-stomp`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("[STOMP]", str),

      onConnect: () => {
        console.log("✅ STOMP connected!");
        stompClientRef.current = client;

        // ✅ 구독 등록
        client.subscribe(`/sub/chat/${roomId}`, (message) => {
          console.log("📩 Received message:", message);
          const msg = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
      },

      onDisconnect: () => {
        console.log("❎ STOMP disconnected");
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomId, token]);

  // ✅ 채팅방 입장 시 마지막 읽은 시간 저장
  useEffect(() => {
    localStorage.setItem(`lastReadAt_room_${roomId}`, new Date().toISOString());
  }, [roomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    const client = stompClientRef.current;
    if (!client || !client.connected) {
      alert("⚠️ 연결이 아직 완료되지 않았습니다.");
      return;
    }

    const message = {
      roomId: Number(roomId),
      content: inputValue.trim(),
      type: "TALK",
    };

    client.publish({
      destination: "/pub/chat.sendMessage",
      body: JSON.stringify(message),
    });

    setInputValue("");
  };

  return (
    <div className="max-w-[500px] mx-auto bg-[#FFF9F3] min-h-screen flex flex-col">
      <div className="sticky top-0 bg-[#FFF8EE] z-30 flex items-center gap-3 p-4 shadow-sm border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="text-gray-700" size={22} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">채팅방</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-16">
        {messages.map((msg, i) => {
          const sender = msg.sender || {};
          const senderId = sender.id != null ? Number(sender.id) : null;
          const myId = Number(loggedInUserId);
          const isOwn = senderId === myId;

          console.log(
            "senderId:",
            senderId,
            "myId:",
            myId,
            "isOwn:",
            isOwn,
            "content:",
            msg.content
          );

          // Format the message time using Date API
          const date = new Date(msg.registeredAt || msg.timestamp);
          const formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={msg.id || i}
              className={`flex ${
                isOwn ? "justify-end" : "justify-start"
              } items-end`}
            >
              {/* 상대방 메시지 */}
              {!isOwn && (
                <div className="flex flex-col items-start max-w-[70%]">
                  <p className="text-xs text-gray-500 mb-1 ml-1">
                    {sender.nickName || sender.username || sender.email}
                  </p>
                  <div className="bg-yellow-100 text-gray-800 rounded-2xl px-4 py-2 shadow">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">
                    {formattedTime}
                  </p>
                </div>
              )}

              {/* 내가 보낸 메시지 */}
              {isOwn && (
                <div className="flex flex-col items-end max-w-[70%]">
                  <div className="bg-orange-400 text-white rounded-2xl px-4 py-2 shadow">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-200 mt-1 mr-1">
                    {formattedTime}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-yellow-50 p-3 flex items-center gap-2 shadow-inner">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className="flex-1 p-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-orange-400 text-white rounded-full px-4 py-2 font-medium hover:bg-orange-500"
        >
          전송
        </button>
      </div>
    </div>
  );
}
