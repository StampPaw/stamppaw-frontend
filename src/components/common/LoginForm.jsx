// src/components/common/LoginForm.jsx
import { useState } from "react";
import { login } from "@/services/authService";
import { Eye, EyeOff } from "lucide-react"; 

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      alert("로그인 성공!");
      onSuccess();
    } catch (error) {
      alert("로그인 실패! 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col items-center gap-4 text-[#4B3F2F]"
    >
      {/* 이메일 입력 */}
      <div className="w-full">
        <label className="block mb-1 font-semibold">이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[#FFD18E] bg-white px-4 py-2 
                     placeholder:text-[#A38B6D] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]"
        />
      </div>

      <div className="w-full">
        <label className="block mb-1 font-semibold">비밀번호</label>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[#FFD18E] bg-white px-4 py-2 pr-10 
                       placeholder:text-[#A38B6D] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF9F43]"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="w-full bg-[#F6C343] hover:bg-[#F5B72E] text-black font-semibold 
                   rounded-lg py-2 mt-4 shadow-soft transition-all"
      >
        로그인
      </button>
    </form>
  );
}
