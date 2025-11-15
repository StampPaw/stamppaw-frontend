import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CompanionReviewWritePage() {
  const { applyId } = useParams();
  const navigate = useNavigate();

  // 선택 가능한 태그 예시 (추후 백엔드에서 불러오기 가능)
  const reviewTags = [
    { id: 1, label: "친절해요" },
    { id: 2, label: "시간 약속을 잘 지켜요" },
    { id: 3, label: "반려견을 잘 케어해요" },
    { id: 4, label: "대화가 즐거워요" },
    { id: 5, label: "매너가 좋아요" },
  ];

  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      alert("태그를 최소 1개 선택해주세요!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/companion/review/${applyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ tags: selectedTags }),
        }
      );

      if (!res.ok) throw new Error("리뷰 작성 실패");

      alert("리뷰가 작성되었습니다!");
      navigate(-1); // 뒤로 이동
    } catch (error) {
      console.error(error);
      alert("리뷰 작성 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold text-[#4C3928] mb-5">리뷰 작성하기</h2>

      <p className="text-sm text-[#7C6A59] mb-3">
        해당 동행에 대한 느낌을 선택해주세요!
      </p>

      {/* 태그 목록 */}
      <div className="flex flex-wrap gap-3 mb-6">
        {reviewTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`
              px-4 py-2 rounded-full border text-sm
              ${
                selectedTags.includes(tag.id)
                  ? "bg-[#FFEDD2] text-[#A76A26] border-[#E3C08D]"
                  : "bg-white text-[#8A7A6C] border-[#E5D6C2]"
              }
            `}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-[#F4C78A] text-white text-base rounded-xl shadow-md hover:bg-[#E7B574] transition disabled:bg-gray-300"
      >
        {loading ? "작성 중..." : "리뷰 제출하기"}
      </button>
    </div>
  );
}
