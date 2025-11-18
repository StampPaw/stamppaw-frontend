import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateUserInfo } from "@/services/userService";
import { logout } from "@/services/authService";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [nicknameError, setNicknameError] = useState("");

  // 유저 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMyInfo();
      setUser(data);
      setNickname(data.nickname || "");
      setBio(data.bio || "");

      if (data.profileImage) {
        setPreview(data.profileImage);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-10">로딩 중...</p>;

  // 이미지 변경
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
    formData.append("bio", bio);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      await updateUserInfo(formData);
      navigate("/profile");
    } catch (err) {
      if (err.response?.data?.message) {
        setNicknameError(err.response.data.message);
      } else {
        setNicknameError("수정 중 오류가 발생했습니다.");
      }
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
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
                ? user.profileImage
                : "/user.svg"             // ⬅⬅⬅ 요기 수정됨!!!
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
        <div className="mb-6 relative">
          <label className="block mb-1 font-semibold text-[#6B5B4A]">
            닉네임
          </label>

          <input
            type="text"
            value={nickname}
            required
            minLength={2}
            maxLength={20}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError("");
            }}
            className={`w-full border ${
              nicknameError ? "border-red-400" : "border-[#FFD18E]"
            } rounded-lg px-4 py-2 bg-white focus:outline-none 
                       focus:ring-2 focus:ring-[#FF9F43]`}
          />

          {nicknameError && (
            <p className="text-sm text-red-500 mt-1">{nicknameError}</p>
          )}
        </div>

        {/* 이메일 */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-[#6B5B4A]">
            이메일
          </label>
          <input
            type="text"
            value={user.email}
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-[#FFF5E0] text-gray-500"
          />
        </div>

        {/* 자기소개 */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-[#6B5B4A]">
            자기소개
          </label>

          <textarea
            value={bio}
            rows={4}
            placeholder="자기소개를 입력하세요 :)"
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-[#FFD18E] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9F43]"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="w-full bg-[#F6C343] hover:bg-[#F5B72E] text-black font-semibold 
                     rounded-lg py-2 mt-4 shadow-soft transition-all"
        >
          저장하기
        </button>
      </div>

      {/* 로그아웃 */}
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
