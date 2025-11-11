import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "", 
    email: "",
    password: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("이용 약관 및 개인정보 처리방침에 동의해주세요.");
      return;
    }
    try {
      await signup({
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
      });
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      alert("회원가입 실패! 입력 정보를 확인해주세요.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-8"
      style={{ backgroundColor: "#FFF8E7" }}
    >
      {/* 상단 헤더 */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-[#4B3F2F] mb-3">
          회원가입
        </h1>
        <p className="text-[#6B3E1E] text-base font-medium">
          계정을 생성하여 시작해 볼까요?
        </p>
      </div>

      {/* 회원가입 폼 */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 text-[#4B3F2F]"
      >
        {/* 닉네임 입력 */}
        <div>
          <label className="block mb-1 font-semibold">닉네임</label>
          <input
            name="nickname" 
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full border border-[#FFD18E] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F43] bg-white placeholder:text-[#A38B6D]"
          />
        </div>

        {/* 이메일 입력 */}
        <div>
          <label className="block mb-1 font-semibold">이메일</label>
          <input
            name="email"
            type="email"
            placeholder="name@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-[#FFD18E] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F43] bg-white placeholder:text-[#A38B6D]"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block mb-1 font-semibold">비밀번호</label>
          <input
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-[#FFD18E] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F43] bg-white placeholder:text-[#A38B6D]"
          />
        </div>

        {/* 약관 동의 체크 */}
        <div className="flex items-center gap-2 mt-2 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="w-4 h-4 accent-[#FF9F43]"
          />
          <span>
            이용 약관 및{" "}
            <span className="text-[#E49B25] font-semibold cursor-pointer">
              개인정보 처리방침
            </span>
            에 동의합니다.
          </span>
        </div>

        {/* 가입 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#F6C343] hover:bg-[#F5B72E] text-black font-semibold rounded-xl py-3 mt-4 shadow-soft transition-all"
        >
          가입하기
        </button>

        {/* 로그인 이동 */}
        <p className="text-center text-sm mt-6 text-gray-600">
          이미 계정이 있으신가요?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#E49B25] font-semibold cursor-pointer hover:underline"
          >
            로그인
          </span>
        </p>
      </form>
    </div>
  );
}
