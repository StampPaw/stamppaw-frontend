import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateUserInfo } from "@/services/userService";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [tokenChecked, setTokenChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 1단계: 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // axios 인터셉터에 토큰 반영될 시간을 줌
    setTimeout(() => setTokenChecked(true), 0);
  }, []);

  // 🔥 2단계: 토큰 준비된 후에만 API 호출
  useEffect(() => {
    if (!tokenChecked) return;

    const fetchUser = async () => {
      try {
        const data = await getMyInfo();
        setUser(data);
        setNickname(data.nickname || "");
      } catch (error) {
        console.error("유저 정보 로드 실패:", error);

        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [tokenChecked]);

  // 🔥 저장 기능
  const handleSave = async () => {
    if (!nickname.trim()) return alert("닉네임을 입력해주세요!");

    try {
      await updateUserInfo({ nickname });
      alert("프로필이 수정되었습니다!");
      navigate("/profile");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-center mt-10 px-6">
      <h2 className="text-2xl font-semibold mb-6">프로필 수정</h2>

      <img
        src={user.profileImage || "/default-profile.png"}
        alt="프로필 이미지"
        className="w-24 h-24 rounded-full mb-4 border"
      />

      <div className="w-full max-w-sm mb-4">
        <label className="block text-gray-600 text-sm mb-1">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="w-full max-w-sm mb-6">
        <label className="block text-gray-600 text-sm mb-1">이메일</label>
        <input
          type="text"
          value={user.email}
          disabled
          className="w-full bg-input text-gray-500 border border-border rounded-lg px-4 py-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full max-w-sm bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ff8a1e] transition"
      >
        저장하기
      </button>
    </div>
  );
}
