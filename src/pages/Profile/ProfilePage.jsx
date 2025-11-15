import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "@/services/userService";
import ProfileFreePage from "./ProfileFreePage";
import ProfileWalkPage from "./ProfileWalkPage";
import ProfileAccompanyManagePage from "./ProfileAccompanyManagePage";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("free");

  // 🔐 토큰 + 유저정보 로딩을 하나의 useEffect로 처리 (원래 네 스타일)
  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1) 토큰 자체가 없으면 → 즉시 로그인 이동 (무한 로딩 방지)
    if (!token) {
      navigate("/login");
      return;
    }

    // 2) 토큰은 있는데 유효성 문제로 401이면 → remove + login 이동
    const fetchUser = async () => {
      try {
        const data = await getMyInfo();
        setUser(data);
      } catch (err) {
        console.error("유저 조회 실패:", err);

        // 백엔드가 401 줬을 때
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6]">
      {/* 🔶 프로필 전체 블록 */}
      <div className="px-5 pt-10 flex items-start gap-6">
        {/* 🔸 왼쪽: 프로필 이미지 */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={
              user.profileImage
                ? `http://localhost:8080/uploads/profile/${user.profileImage}`
                : "/default-profile.png"
            }
            className="w-full h-full rounded-full object-cover border border-gray-200"
          />

          {/* ✏ 수정 아이콘 */}
          <button
            onClick={() => navigate("/profile/edit")}
            className="
              absolute bottom-0 right-0 
              w-9 h-9 bg-[#F6C343] rounded-full shadow 
              flex items-center justify-center overflow-hidden
            "
          >
            <img src="/Edit.svg" className="w-[60%]" />
          </button>
        </div>

        {/* 🔸 오른쪽: 닉네임 + 버튼 + 소개 + 기록 */}
        <div className="flex flex-col w-full">
          {/* 닉네임 + 팔로우 버튼 */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-[#4C3728]">{user.nickname}</p>

            <button className="px-6 py-2 bg-[#EDA258] text-white rounded-full text-lg font-semibold">
              팔로우
            </button>
          </div>

          {/* 자기소개 */}
          <p className="text-[#6B5B4A] text-lg mt-1">
            {user.bio || "자기소개를 입력해 보세요!"}
          </p>

          {/* 기록 / 팔로워 / 팔로잉 */}
          <div className="mt-4 flex flex-row items-center gap-10">
            <div className="text-center">
              <p className="text-lg font-semibold">{user.recordCount ?? 0}</p>
              <p className="text-xs text-[#B38A6A]">기록</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold">{user.followerCount ?? 0}</p>
              <p className="text-xs text-[#B38A6A]">팔로워</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold">
                {user.followingCount ?? 0}
              </p>
              <p className="text-xs text-[#B38A6A]">팔로잉</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔶 강아지 썸네일 영역 */}
      <div className="mt-6 px-5 flex gap-3 overflow-x-auto pb-2">
        {(user.dogs ?? []).length > 0 ? (
          user.dogs.map((dog) => (
            <div
              key={dog.id}
              className="w-14 h-14 rounded-full overflow-hidden shadow bg-[#FFF7E3]"
            >
              <img
                src={dog.imageUrl}
                alt={dog.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="text-sm text-[#B38A6A]">
            등록된 반려견이 없어요 🐶
          </div>
        )}
      </div>

      {/* 🔶 탭 메뉴 */}
      <div className="flex px-5 mt-8 border-b border-[#F4E4C2]">
        {/* 자유 */}
        <button
          className={`px-4 pb-3 text-sm ${
            tab === "free"
              ? "text-[#4C3728] font-semibold border-b-2 border-[#EDA258]"
              : "text-[#8D7B6C]"
          }`}
          onClick={() => setTab("free")}
        >
          자유
        </button>

        {/* 산책 */}
        <button
          className={`px-4 pb-3 text-sm ${
            tab === "walk"
              ? "text-[#4C3728] font-semibold border-b-2 border-[#EDA258]"
              : "text-[#8D7B6C]"
          }`}
          onClick={() => setTab("walk")}
        >
          산책
        </button>

        {/* 동행 */}
        <button
          className={`px-4 pb-3 text-sm ${
            tab === "accompany"
              ? "text-[#4C3728] font-semibold border-b-2 border-[#EDA258]"
              : "text-[#8D7B6C]"
          }`}
          onClick={() => setTab("accompany")}
        >
          동행
        </button>
      </div>

      {/* 🔶 탭별 렌더링 */}
      <div className="mt-5 px-5">
        {tab === "free" && <ProfileFreePage user={user} />}
        {tab === "walk" && <ProfileWalkPage user={user} />}
        {tab === "accompany" && <ProfileAccompanyManagePage user={user} />}
      </div>

      <div className="h-20" />
    </div>
  );
}
