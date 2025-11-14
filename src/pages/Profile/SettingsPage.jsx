import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SettingsPage() {
  const navigate = useNavigate();

  // 🔥 페이지 접근 시 토큰 체크 (없으면 login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // 🔥 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  const menuItems = [
    { title: "프로필 수정하기", action: () => navigate("/profile/edit") },
    { title: "결제 내역 보기", action: () => alert("추후 업데이트 예정입니다!") },
    { title: "알림 설정", action: () => alert("추후 추가될 기능입니다!") },
    { title: "언어 설정", action: () => alert("추후 추가될 기능입니다!") },
  ];

  return (
    <div className="px-6 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">설정 및 활동</h2>

      {/* 메뉴 리스트 */}
      <ul className="divide-y divide-gray-200">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={item.action}
            className="py-4 cursor-pointer text-gray-800 hover:text-primary transition"
          >
            {item.title}
          </li>
        ))}
      </ul>

      {/* 버튼 영역 */}
      <div className="mt-10 flex flex-col items-center gap-3">

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full max-w-sm bg-red-400 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-500 transition"
        >
          로그아웃
        </button>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate("/profile")}
          className="w-full max-w-sm border border-primary text-primary font-medium px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition"
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
}
