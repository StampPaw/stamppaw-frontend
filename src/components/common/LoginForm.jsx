// src/components/common/LoginForm.jsx
import { useState } from "react";
import { login } from "@/services/authService";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      className="w-full max-w-sm flex flex-col items-center gap-4"
    >
      {/* 이메일 */}
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-[#F6C343]/40 bg-[#FFFDF6] px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F6C343]"
      />

      {/* 비밀번호 */}
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl border border-[#F6C343]/40 bg-[#FFFDF6] px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F6C343]"
      />

      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="w-full bg-[#F6C343] hover:bg-[#F5B72E] text-[#3F2E00] text-lg font-bold py-3 rounded-xl mt-2 transition-all"
      >
        로그인
      </button>
    </form>
  );
}