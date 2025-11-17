import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDogById, deleteDog } from "@/services/dogService";

export default function DogDetailPage() {
  const navigate = useNavigate();
  const { dogId } = useParams();

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  // 삭제 모달 상태
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

  const handleOpenDelete = () => setShowDeleteModal(true);

  const handleCloseDelete = () => {
    if (deleting) return;
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteDog(dogId);          // ✅ 실제 삭제 호출
      setShowDeleteModal(false);
      navigate("/profile");           // 삭제 후 프로필로 이동
    } catch (err) {
      console.error("반려견 삭제 실패:", err);
      alert("반려견 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (!dog) return <p className="text-center mt-10">반려견 정보가 없습니다.</p>;

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6] px-6 py-8 relative">
      <h2 className="text-xl font-bold text-[#4C3728] mb-6">반려견 상세 정보</h2>

      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center">
        <div className="w-30 h-30 rounded-full overflow-hidden bg-[#FFF7E3] shadow">
          <img
            src={dog.image_url || "/default-dog.png"}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-lg font-semibold text-[#4C3728] mt-3">{dog.name}</p>
        <p className="text-sm text-[#6B5B4A]">{dog.breed}</p>
      </div>

      {/* 상세 정보 */}
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

      {/* 수정 버튼 */}
      <button
        onClick={() => navigate(`/dogs/${dogId}/edit`)}
        className="w-full py-3 bg-[#F6C343] text-[#4C3728] font-semibold rounded-lg"
      >
        수정하기
      </button>

      {/* 🔻 로그아웃 스타일의 삭제 버튼 */}
      <button
        type="button"
        onClick={handleOpenDelete}
        className="mt-6 w-full text-center text-sm text-[#8D7B6C] underline"
      >
        반려견 삭제
      </button>

      {/*삭제 확인 모달 */}
      {showDeleteModal && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center 
          bg-black/30 backdrop-blur-sm">
          <div className="w-[80%] max-w-sm bg-white rounded-2xl shadow-lg px-6 py-6 text-center">
            <p className="text-base font-semibold text-[#4C3728] mb-4">
              반려동물을 삭제하시겠습니까?
            </p>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={handleCloseDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-[#F5F2EC] text-[#6B5B4A] font-semibold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
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
