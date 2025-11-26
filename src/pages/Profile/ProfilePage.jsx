import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMyInfo, getUserInfo } from "@/services/userService";
import { followUser, unfollowUser } from "@/services/followService";

import ProfileFreePage from "./ProfileFreePage";
import WalkListPage from "../walk/WalkListPage";
import ProfileAccompanyManagePage from "./ProfileAccompanyManagePage";
import ProfilePartTimeManagePage from "./ProfilePartTimeManagePage.jsx";
import { useBadgeStore } from "../../stores/useBadgeStore";
import BadgeList from "../../components/badge/BadgeList";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL 파라미터 (다른 유저 프로필일 때 사용)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("free");

  // 로컬 유저 (내 정보)
  const localUser = JSON.parse(localStorage.getItem("user"));
  const totalPoint = localUser?.totalPoint ?? 0;

  // 내 프로필인지 판별 (URL id와 localUser.id 비교)
  const isMyProfile = !id || Number(id) === Number(localUser?.id);

  // 대표 뱃지
  const { representative, badges } = useBadgeStore();
  const repBadge = badges.find((b) => b.badgeId === representative);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = id ? await getUserInfo(id) : await getMyInfo();
        setUser(data);
      } catch (err) {
        console.error("프로필 조회 실패:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6]">
      <div className="px-5 pt-10 flex items-start gap-6">
        {/* 프로필 이미지 */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={user.profileImage ? user.profileImage : "/user.svg"}
            className="w-full h-full rounded-full object-cover border border-gray-200"
          />

          {/* 내 프로필일 때만 수정 버튼 보임 */}
          {isMyProfile && (
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
          )}
        </div>

        {/* 닉네임 / 자기소개 / 팔로우 */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-[#4C3728]">
                {user.nickname}
              </p>

              {repBadge && <img src={repBadge.iconUrl} className="w-7 h-7" />}
            </div>

            {/* 내 프로필이 아닐 때만 팔로우 버튼 표시 */}
            {!isMyProfile && (
              <button
                onClick={async () => {
                  try {
                    if (user.isFollowing) {
                      await unfollowUser(user.id);
                    } else {
                      await followUser(user.id);
                    }
                    const updated = await getUserInfo(user.id);
                    setUser(updated);
                  } catch (err) {
                    console.error("팔로우/언팔 오류:", err);
                  }
                }}
                className={`px-6 py-2 rounded-full text-lg font-semibold 
                  ${
                    user.isFollowing
                      ? "bg-gray-300 text-[#4C3728]"
                      : "bg-[#EDA258] text-white"
                  }`}
              >
                {user.isFollowing ? "언팔로우" : "팔로우"}
              </button>
            )}
          </div>

          {/* 자기소개 */}
          <p className="text-[#6B5B4A] text-lg mt-1">
            {user.bio || "자기소개를 입력해 보세요!"}
          </p>

          {/* 기록 · 팔로워 · 팔로잉 · 포인트 */}
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

            {/* 포인트는 내 프로필에서만 표시 */}
            {isMyProfile && (
              <div className="flex items-center gap-1">
                <p className="text-xs text-[#B38A6A]">💰 적립 포인트</p>
                <p className="text-sm font-semibold text-[#B5802A]">
                  {totalPoint} P
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 반려견 영역 */}
      <div className="mt-1 px-5">
        <p className="text-base font-semibold text-[#6B5B4A] mb-3">
          {isMyProfile ? "나의 반려동물 🐾" : "반려동물 🐾"}
        </p>

        {(user.dogs ?? []).length > 0 ? (
          <div className="flex items-start gap-4 overflow-x-auto pb-2">
            {user.dogs.map((dog) => (
              <div
                key={dog.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => navigate(`/dogs/${dog.id}`)}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden shadow bg-[#FFF7E3]">
                  <img
                    src={dog.imageUrl || "/dog.png"}
                    alt={dog.name}
                    className="w-full h-full object-cover scale-[1.5] translate-y-3"
                    style={{ transformOrigin: "center" }}
                  />
                </div>
                <p className="text-xs text-[#6B5B4A] mt-1">{dog.name}</p>
              </div>
            ))}

            {/* 내 프로필일 때만 반려견 추가 버튼 표시 */}
            {isMyProfile && (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => navigate("/dogs/add")}
                  className="w-16 h-16 rounded-full bg-[#F3E9D2] flex items-center justify-center shadow"
                >
                  <span className="text-[#D4A055] text-3xl font-bold">+</span>
                </button>
                <p className="text-xs text-[#F3E9D2] mt-1"> </p>
              </div>
            )}
          </div>
        ) : (
          isMyProfile && (
            <div className="flex flex-col items-start gap-3">
              <button
                onClick={() => navigate("/dogs/add")}
                className="w-14 h-14 rounded-full bg-[#F3E9D2] flex items-center justify-center shadow"
              >
                <span className="text-[#D4A055] text-3xl font-bold">+</span>
              </button>
            </div>
          )
        )}
      </div>

      {/* 탭 메뉴 */}
      <div className="flex px-5 mt-8 border-b border-[#F4E4C2]">
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

        <button
          className={`px-4 pb-3 text-sm ${
            tab === "parttime"
              ? "text-[#4C3728] font-semibold border-b-2 border-[#EDA258]"
              : "text-[#8D7B6C]"
          }`}
          onClick={() => setTab("parttime")}
        >
          알바
        </button>


        <button
          className={`px-4 pb-3 text-sm ${
            tab === "badge"
              ? "text-[#4C3728] font-semibold border-b-2 border-[#EDA258]"
              : "text-[#8D7B6C]"
          }`}
          onClick={() => setTab("badge")}
        >
          뱃지
        </button>
      </div>

      {/* 탭 렌더링 */}
      <div className="mt-5 px-5">
        {tab === "free" && <ProfileFreePage user={user} />}
        {tab === "walk" && <WalkListPage userId={user.id} />}

        {tab === "accompany" && <ProfileAccompanyManagePage user={user} />}
        {tab === "parttime" && <ProfilePartTimeManagePage user={user} />}

        {tab === "badge" && <BadgeList user={user} />}
      </div>

      <div className="h-20" />
    </div>
  );
}
