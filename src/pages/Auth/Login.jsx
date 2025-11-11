import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/common/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: "#FFF8E7" }} 
    >

      {/* 로고 */}
      <img src="/login.png" alt="StampPaw" className="w-[70%] mb-3" />

      {/* 로그인 폼 */}
      <LoginForm onSuccess={() => navigate("/")} />

      {/* 회원가입 이동 */}
      <p className="text-sm text-gray-600 mt-6">
        계정이 없으신가요?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-[#E0A300] font-semibold cursor-pointer hover:underline"
        >
          회원가입
        </span>
      </p>
    </div>
  );
}