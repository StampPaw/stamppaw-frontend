import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "@/services/userService";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await getMyInfo();
      setUser(data);
    } catch (error) {
      console.error("유저 정보 요청 실패:", error);

      // 실제 토큰이 없는 401일 때만 로그인으로 이동
      const token = localStorage.getItem("token");
      if (!token) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 토큰 체크 먼저 (getMyInfo()보다 먼저 실행)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // 🔥 axios 인터셉터가 token을 읽을 시간을 만들어줌
    setTimeout(() => {
      setTokenChecked(true);
    }, 0);
  }, []);

  // 🔥 토큰 준비 완료 후에만 API 호출
  useEffect(() => {
    if (!tokenChecked) return;
    fetchUser();
  }, [tokenChecked]);

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-center mt-8">
      <div
        className="relative w-24 h-24 mb-4"
        onClick={() => navigate("/profile/edit")}
      >
        <img
          src={user.profileImage || "/default-profile.png"}
          alt="프로필 이미지"
          className="w-full h-full rounded-full object-cover border border-gray-200 cursor-pointer"
        />
        <span className="absolute bottom-1 right-1 bg-primary text-white text-xs px-2 py-1 rounded">
          수정
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-1">{user.nickname}</h2>
      <p className="text-gray-500 mb-4">{user.email}</p>

      <div className="flex gap-2">
        <button
          onClick={() => navigate("/profile/settings")}
          className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ff8a1e] transition"
        >
          설정
        </button>

        <button
          onClick={() => navigate("/dogs")}
          className="border border-primary text-primary font-medium px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition"
        >
          내 반려견
        </button>
      </div>
    </div>
  );
}
