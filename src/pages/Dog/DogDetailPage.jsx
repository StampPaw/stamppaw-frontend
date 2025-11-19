import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDogById, deleteDog } from "@/services/dogService";

export default function DogDetailPage() {
  const navigate = useNavigate();
  const { dogId } = useParams();

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

      {/* 제목 */}
      <h2 className="text-xl font-bold text-[#4C3728] mb-6">반려견 상세 정보</h2>

      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-30 h-30 rounded-full overflow-hidden shadow-md bg-[#FFF7E3]">
          <img
            src={dog.imageUrl || "/dog.png"}
            className="w-full h-full object-cover scale-[1.5] translate-y-3"
          />
        </div>

        <p className="text-xl font-bold text-[#4C3728] mt-4">{dog.name}</p>
        <p className="text-sm text-[#7A6A58]">{dog.breed}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E5DCC5] w-full my-8"></div>

      {/* 정보 카드 */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6">
        <h3 className="text-[#4C3728] font-bold text-lg mb-5">🐾 기본 정보</h3>

        <div className="grid grid-cols-[13%_1fr] gap-y-4">

          {/* 이름 */}
          <div className="text-[#5A4636] font-semibold text-sm">
            이름:
          </div>
          <div className="text-[#4C3728] font-medium text-base">
            {dog.name}
          </div>

          {/* 품종 */}
          <div className="text-[#5A4636] font-semibold text-sm">
            품종:
          </div>
          <div className="text-[#4C3728] font-medium text-base">
            {dog.breed || "정보 없음"}
          </div>

          {/* 나이 */}
          <div className="text-[#5A4636] font-semibold text-sm">
            나이:
          </div>
          <div className="text-[#4C3728] font-medium text-base">
            {dog.age ? `${dog.age}살` : "정보 없음"}
          </div>

          {/* 성격 */}
          <div className="text-[#5A4636] font-semibold text-sm">
            성격:
          </div>
          <div className="text-[#4C3728] font-medium text-base">
            {dog.character || "정보 없음"}
          </div>

        </div>
      </div>


      {/* 수정 버튼 */}
      <button
        onClick={() => navigate(`/dogs/${dogId}/edit`)}
        className="w-full py-3 bg-[#F6C343] hover:bg-[#F5B72E] text-[#4C3728] font-semibold rounded-xl mt-10 shadow"
      >
        수정하기
      </button>

      {/* 삭제 버튼 */}
      <button
        onClick={() => setShowDeleteModal(true)}
        className="mt-5 w-full text-center text-sm text-[#8D7B6C] underline"
      >
        반려견 삭제
      </button>

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[80%] max-w-sm bg-white rounded-2xl shadow-lg px-6 py-6 text-center">
            <p className="text-base font-semibold text-[#4C3728] mb-4">
              반려동물을 삭제하시겠습니까?
            </p>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#F5F2EC] text-[#6B5B4A] font-semibold"
              >
                취소
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await deleteDog(dogId);
                    navigate("/profile");
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-[#F6C343] text-[#4C3728] font-semibold"
              >
                {deleting ? "삭제 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
