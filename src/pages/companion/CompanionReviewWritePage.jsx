import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CompanionReviewWritePage() {
  const { applyId } = useParams();
  const navigate = useNavigate();

  const [reviewTags, setReviewTags] = useState([]); // ← 기존 하드코딩 삭제
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);

  // 🔥 태그 목록 불러오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/companion/review/all-tags",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("태그 목록을 불러오지 못했습니다.");
        }

        const data = await res.json();
        setReviewTags(data); // [{id, tag}] 형태
      } catch (err) {
        console.error(err);
        alert("태그 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, tagId];
    });
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
      navigate(-1);
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

      {/* 태그 로딩 상태 */}
      {loadingTags ? (
        <p className="text-[#8A7A6C] mb-5">태그 불러오는 중...</p>
      ) : (
        <div className="flex flex-wrap gap-3 mb-6">
          {reviewTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              disabled={
                selectedTags.length >= 5 && !selectedTags.includes(tag.id)
              }
              className={`
                px-4 py-2 rounded-full border text-sm
                ${
                  selectedTags.includes(tag.id)
                    ? "bg-[#FFEDD2] text-[#A76A26] border-[#E3C08D]"
                    : "bg-white text-[#8A7A6C] border-[#E5D6C2]"
                }
                ${
                  selectedTags.length >= 5 && !selectedTags.includes(tag.id)
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {tag.tag}
            </button>
          ))}
        </div>
      )}

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
