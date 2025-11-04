import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <section>
        <h2 className="text-xl font-semibold mb-4">Inputs1</h2>
        <div className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="이메일을 입력해주세요"
            className="w-full bg-input border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              className="w-full bg-input border border-border rounded-lg px-4 py-2 pr-10 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary transition"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Eye className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Inputs2</h2>
        <div className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="이메일을 입력해주세요"
            className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Inputs3</h2>
        <textarea
          placeholder="메모를 작성해주세요"
          rows={3}
          className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        ></textarea>
      </section>
    </>
  );
}
