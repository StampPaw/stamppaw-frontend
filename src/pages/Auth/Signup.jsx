import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/services/authService";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    agree: false,
  });

  const nicknameRef = useRef(null);
  const emailRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

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

    } catch (err) {
      console.log("Signup error:", err);

      const errorMsg = err.response?.data?.message;

      if (errorMsg?.includes("닉네임")) {
        nicknameRef.current.setCustomValidity(errorMsg);
        nicknameRef.current.reportValidity();
        return;
      }

      if (errorMsg?.includes("이메일")) {
        emailRef.current.setCustomValidity(errorMsg);
        emailRef.current.reportValidity();
        return;
      }

      alert("회원가입 실패! 입력 정보를 확인해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8" 
         style={{ backgroundColor: "#FFF8E7" }}>

      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-[#4B3F2F] mb-3">회원가입</h1>
        <p className="text-[#6B3E1E] text-base font-medium">
          계정을 생성하여 시작해 볼까요?
        </p>
      </div>

      <form onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 text-[#4B3F2F]">
        
        {/* 닉네임 */}
        <div>
          <label className="block mb-1 font-semibold">닉네임</label>
          <input
            ref={nicknameRef}
            name="nickname"
            type="text"
            value={formData.nickname}
            placeholder="닉네임을 입력해주세요"
            onChange={(e) => {
              nicknameRef.current.setCustomValidity("");  
              handleChange(e);
            }}
            required
            className="w-full border border-[#FFD18E] rounded-lg px-4 py-2 bg-white"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="block mb-1 font-semibold">이메일</label>
          <input
            ref={emailRef}
            name="email"
            type="email"
            value={formData.email}
            placeholder="name@email.com"
            onChange={(e) => {
              emailRef.current.setCustomValidity("");  
              handleChange(e);
            }}
            required
            className="w-full border border-[#FFD18E] rounded-lg px-4 py-2 bg-white"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block mb-1 font-semibold">비밀번호</label>
          <div className="relative w-full">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요 (6자리 이상)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-[#FFD18E] rounded-lg px-4 py-2 pr-10 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF9F43]"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* 동의 */}
        <div className="flex items-center gap-2 mt-2 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="w-4 h-4 accent-[#FF9F43]"
          />
          <span>
            이용 약관 및 <span className="text-[#E49B25] font-semibold cursor-pointer">
              개인정보 처리방침
            </span> 에 동의합니다.
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-[#F6C343] hover:bg-[#F5B72E] rounded-lg py-2 mt-4 text-black font-semibold"
        >
          가입하기
        </button>

      </form>
    </div>
  );
}
