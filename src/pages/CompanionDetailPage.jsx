import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/ui/Header";
import NavBar from "../components/ui/NavBar";

export default function CompanionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companion, setCompanion] = useState(null);

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

  if (!companion) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] flex flex-col relative mx-auto h-screen">
        {/* ✅ 상단 고정 헤더 */}
        <div className="sticky top-0 bg-[#FFF8EE] z-20 flex items-center gap-3 p-4 shadow-sm border-b border-gray-200">
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

        {/* ✅ 본문 */}
        <main className="flex-1 overflow-y-auto pb-28">
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
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {companion.title}
            </h1>

            {/* 작성자 정보 */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img
                  src={
                    companion.user?.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                  }
                  alt="author"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="font-medium">
                  {companion.user?.nickName || "익명"}
                </span>
              </div>
              <span>{new Date(companion.registeredAt).toLocaleString()}</span>
            </div>

            {/* 내용 */}
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {companion.content}
            </p>
          </div>
        </main>

        {/* ✅ 하단 네비게이션 */}
        <nav className="sticky bottom-0 w-full shadow-lg bg-[#FFF8EE] border-t border-gray-200">
          <NavBar />
        </nav>
      </div>
    </div>
  );
}
