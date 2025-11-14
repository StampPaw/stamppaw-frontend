import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateUserInfo } from "@/services/userService";
import { logout } from "@/services/authService";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  // 유저 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMyInfo();
      setUser(data);
      setNickname(data.nickname);

      if (data.profileImage) {
        setPreview(`http://localhost:8080/uploads/profile/${data.profileImage}`);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-10">로딩 중...</p>;

  // 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 저장하기
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("nickname", nickname);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      await updateUserInfo(formData);
      alert("프로필이 수정되었습니다!");
      navigate("/profile");
    } catch (err) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout(); // optional: 백엔드에 요청
    } catch (_) {}

    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6] pb-24">

      {/* 제목 */}
      <h2 className="text-center text-2xl font-bold text-[#4C3728] mt-10">
        프로필 수정
      </h2>

      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center mt-8">
        <label className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
          <img
            src={
              preview
                ? preview
                : user.profileImage
                ? `http://localhost:8080/uploads/profile/${user.profileImage}`
                : "/default-profile.png"
            }
            className="w-32 h-32 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <p className="text-sm text-[#8D7B6C] mt-2">
          프로필 이미지를 변경하려면 클릭하세요
        </p>
      </div>

      {/* 입력 섹션 */}
      <div className="px-8 mt-10">

        {/* 닉네임 */}
        <div className="mb-6">
          <label className="block text-sm text-[#6B5B4A] mb-1">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 rounded-md border border-[#F6C343] bg-white focus:outline-none"
          />
        </div>

        {/* 이메일 */}
        <div className="mb-6">
          <label className="block text-sm text-[#6B5B4A] mb-1">이메일</label>
          <input
            type="text"
            value={user.email}
            disabled
            className="w-full p-3 rounded-md border border-gray-300 bg-[#FFF5E0] text-gray-500"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-[#ff8a1e] transition"
        >
          저장하기
        </button>

      </div>

      {/* 🔥 카카오 스타일 “로그아웃” 텍스트 */}
      <div className="flex justify-center mt-12">
        <button
          onClick={handleLogout}
          className="text-[#8D7B6C] text-base underline underline-offset-4"
        >
          로그아웃
        </button>
      </div>

    </div>
  );
}
