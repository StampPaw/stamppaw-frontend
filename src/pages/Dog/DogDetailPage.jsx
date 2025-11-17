import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDogById } from "@/services/dogService";

export default function DogDetailPage() {
  const navigate = useNavigate();
  const { dogId } = useParams();

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const data = await getDogById(dogId);
        setDog(data);
      } catch (err) {
        console.error("반려견 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [dogId]);

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (!dog) return <p className="text-center mt-10">반려견 정보가 없습니다.</p>;

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6] px-6 py-8">

      <h2 className="text-xl font-bold text-[#4C3728] mb-6">
        반려견 상세 정보
      </h2>

      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-[#FFF7E3] shadow">
          <img
            src={dog.image_url || "/default-dog.png"}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-lg font-semibold text-[#4C3728] mt-3">{dog.name}</p>
        <p className="text-sm text-[#6B5B4A]">{dog.breed}</p>
      </div>

      {/* 상세 정보 폼 스타일 */}
      <div className="space-y-4 mb-8">

        <div className="flex flex-col">
          <label className="text-sm text-[#6B5B4A] mb-1">이름</label>
          <div className="w-full bg-white rounded-lg p-3 shadow text-[#4C3728]">
            {dog.name}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[#6B5B4A] mb-1">품종</label>
          <div className="w-full bg-white rounded-lg p-3 shadow text-[#4C3728]">
            {dog.breed || "정보 없음"}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[#6B5B4A] mb-1">나이</label>
          <div className="w-full bg-white rounded-lg p-3 shadow text-[#4C3728]">
            {dog.age ? `${dog.age}살` : "정보 없음"}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[#6B5B4A] mb-1">성격</label>
          <div className="w-full bg-white rounded-lg p-3 shadow text-[#4C3728]">
            {dog.character || "정보 없음"}
          </div>
        </div>

      </div>

      <button
        onClick={() => navigate(`/dogs/${dogId}/edit`)}
        className="w-full py-3 bg-[#F6C343] text-[#4C3728] font-semibold rounded-lg"
      >
        수정하기
      </button>
    </div>
  );
}
