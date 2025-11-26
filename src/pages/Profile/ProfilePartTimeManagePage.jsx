import { useState } from "react";
import ProfilePartTimePage from "./ProfilePartTimePage";
import ProfilePartTimeApplyPage from "./ProfilePartTimeApplyPage";

export default function ProfilePartTimeManagePage() {
  const [tab, setTab] = useState("parttime");

  return (
    <div className="mt-5">
      <div className="flex gap-5 border-b border-[#cbcbcb] pb-2 mb-5">
        <button
          onClick={() => setTab("parttime")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "parttime"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          작성한 알바글
        </button>

        <button
          onClick={() => setTab("apply")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "apply"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          신청한 알바
        </button>

        <button
          onClick={() => setTab("send")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "send"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          작성한 리뷰
        </button>

        <button
          onClick={() => setTab("receive")}
          className={`pb-2 px-2 py-1 text-sm ${
            tab === "receive"
              ? "border-b-2 border-[#D79A55] font-semibold"
              : "text-gray-500 hover:text-[#C28A50]"
          }`}
        >
          받은 리뷰
        </button>
      </div>

      <div className="mt-3">
        {tab === "parttime" && <ProfilePartTimePage />}
        {tab === "apply" && <ProfilePartTimeApplyPage />}
      </div>
    </div>
  );
}
