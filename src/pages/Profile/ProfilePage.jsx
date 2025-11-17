import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "@/services/userService";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getMyInfo();
        setUser(data);
      } catch (err) {
        console.error("유저 조회 실패:", err);

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

      {/* 프로필 전체 블록 */}
      <div className="px-5 pt-10 flex items-start gap-6">
        
        {/* 프로필 이미지 */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={user.profileImage ? user.profileImage : "/default-profile.png"}
            className="w-full h-full rounded-full object-cover border border-gray-200"
          />

          {/* 수정 아이콘 */}
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

        {/* 닉네임/소개/기록 */}
        <div className="flex flex-col w-full">

          {/* 닉네임 + 팔로우 */}
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
              <p className="text-lg font-semibold">{user.followingCount ?? 0}</p>
              <p className="text-xs text-[#B38A6A]">팔로잉</p>
            </div>
          </div>

        </div>
      </div>

      {/* 반려견 영역 */}
      <div className="mt-1 px-5">
        <p className="text-base font-semibold text-[#6B5B4A] mb-3">
          나의 반려동물 🐾
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
                    src={dog.image_url || "/default-dog.png"} 
                    alt={dog.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-[#6B5B4A] mt-1">{dog.name}</p>
              </div>
            ))}

            {/* + 버튼도 동일한 구조로 감싸기 */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => navigate("/dogs/add")}
                className="w-16 h-16 rounded-full bg-[#F3E9D2] flex items-center justify-center shadow"
              >
                <span className="text-[#D4A055] text-3xl font-bold">+</span>
              </button>
              <p className="text-xs text-[#F3E9D2] mt-1">{" "}</p>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <button
              onClick={() => navigate("/dogs/add")}
              className="w-14 h-14 rounded-full bg-[#F3E9D2] flex items-center justify-center shadow"
            >
              <span className="text-[#D4A055] text-3xl font-bold">+</span>
            </button>
          </div>
        )}
      </div>


      {/* 탭 메뉴 */}
      <div className="flex px-5 mt-8 border-b border-[#F4E4C2]">
        <button className="px-4 pb-3 text-sm text-[#8D7B6C]" onClick={() => navigate("/profile/free")}>
          자유
        </button>
        <button className="px-4 pb-3 text-sm text-[#8D7B6C]" onClick={() => navigate("/profile/walk")}>
          산책
        </button>
        <button className="px-4 pb-3 text-sm text-[#8D7B6C]" onClick={() => navigate("/profile/accompany")}>
          동행
        </button>
      </div>

      <div className="h-20" />
    </div>
  );
}
