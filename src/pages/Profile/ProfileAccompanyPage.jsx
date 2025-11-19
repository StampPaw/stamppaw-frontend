import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileAccompanyPage() {
  const [companions, setCompanions] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const size = 5;

  const navigate = useNavigate();

  const fetchCompanions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/companion/myCompanion?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("동행글 목록 불러오기 실패");

      const data = await res.json();
      const content = data.content || [];

      setCompanions((prev) => {
        const merged = [...prev, ...content];
        // id 기준으로 중복 제거
        return merged.filter(
          (item, idx, arr) => arr.findIndex((v) => v.id === item.id) === idx
        );
      });

      setHasNext(!data.last);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanions();
  }, [page]);

  const handleLoadMore = () => {
    if (hasNext) setPage((prev) => prev + 1);
  };

  const statusLabel = (status) => {
    switch (status) {
      case "ONGOING":
        return "모집중";
      case "CLOSED":
        return "마감";
      default:
        return status;
    }
  };

  if (!loading && companions.length === 0) {
    return (
      <div className="text-center mt-10 text-[#8D8D8D]">
        작성한 동행글이 없어요 🐶
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-4">
      {companions.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/companion/${item.id}`)}
          className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#F3E9D7] cursor-pointer hover:bg-[#FFF9F2] transition"
        >
          {item.image ? (
            <img
              src={item.image}
              alt="thumbnail"
              className="w-24 h-24 object-cover rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-[#F6F2EA] flex items-center justify-center text-sm text-[#B8AFA5]">
              No Image
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#4C3928]">
                {item.title}
              </h3>
              <p
                className={`text-xs px-2 py-1 rounded-full ${
                  item.status === "ONGOING"
                    ? "bg-[#FFD8A8] text-[#7A4B18]"
                    : "bg-[#E0E0E0] text-[#6B6B6B]"
                }`}
              >
                {statusLabel(item.status)}
              </p>
            </div>

            <p className="text-sm text-[#8D7B6C] mt-1 line-clamp-2">
              {item.content}
            </p>

            <p className="text-[11px] text-[#C5B8A9] mt-2">
              작성일: {new Date(item.registeredAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}

      {hasNext && !loading && (
        <button
          onClick={handleLoadMore}
          className="w-full py-3 mt-3 text-sm text-[#6E4D28] bg-[#F9EBD8] rounded-lg shadow"
        >
          더 보기
        </button>
      )}

      {loading && <p className="text-center text-sm mt-3">로딩 중...</p>}
    </div>
  );
}
