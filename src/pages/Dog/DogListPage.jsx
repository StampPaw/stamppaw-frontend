import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDogs } from "@/services/dogService";

export default function DogListPage() {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const data = await getMyDogs();
        setDogs(data);
      } catch (err) {
        console.error("강아지 불러오기 실패:", err);
      }
    };

    fetchDogs();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FFFDF6] p-6">

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-[#4C3728] mb-6">내 반려견</h2>

      {/* 반려견 리스트 */}
      <div className="grid grid-cols-2 gap-4">
        {dogs.length > 0 ? (
          dogs.map((dog) => (
            <div
              key={dog.id}
              className="bg-white p-4 rounded-xl shadow cursor-pointer"
              onClick={() => navigate(`/dogs/${dog.id}`)}
            >
              <img
                src={
                  dog.image_url && dog.image_url.trim() !== ""
                    ? dog.image_url
                    : "/dog.png"
                }
                alt={dog.name}
                className="w-full h-28 object-cover rounded-lg"
              />

              <p className="mt-2 text-lg font-semibold text-[#4C3728]">
                {dog.name}
              </p>
              <p className="text-sm text-[#8D7B6C]">{dog.breed}</p>
            </div>
          ))
        ) : (
          <p className="text-[#8D7B6C]">등록된 반려견이 없습니다.</p>
        )}
      </div>

      {/* 등록 버튼 */}
      <button
        onClick={() => navigate("/dogs/add")}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#F6C343] text-white font-semibold rounded-full shadow-lg"
      >
        + 반려견 등록하기
      </button>
    </div>
  );
}
