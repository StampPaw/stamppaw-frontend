import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function FollowListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const endpoint =
        type === "follower" ? `/follows/follower` : `/follows/following`;

      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`팔로우 목록 불러오기 실패 (status: ${res.status})`);

      const data = await res.json();
      setList(data);
    } catch (e) {
      console.error(e);
      if (String(e).includes("401")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  if (!token) return <p className="mt-10 text-center">로그인이 필요합니다.</p>;

  return (
    <div className="min-h-screen bg-[#FFFDF6] px-4 pb-20">
      <header className="flex items-center justify-between py-4">
        <button onClick={() => navigate(-1)} className="text-[#B38A6A] mt-1 p-1">
          <ArrowLeft className="w-6 h-6 text-[#B38A6A]" />
        </button>
        <p className="font-semibold text-[#4C3728]">
          {type === "follower" ? "팔로워" : "팔로잉"}
        </p>
        <div className="w-6" />
      </header>

      {loading ? (
        <p className="text-center text-[#B38A6A] mt-6">불러오는 중...</p>
      ) : list.length === 0 ? (
        <p className="text-center text-[#B38A6A] mt-6">아무도 없습니다 😢</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {list.map((u) => (
            <li
              key={`${u?.id ?? Math.random()}-${u?.nickname ?? ""}`}
              className="flex items-center justify-start gap-3 bg-white rounded-2xl px-3 py-2 shadow cursor-pointer"
              onClick={() => navigate(`/profile/${u.id}`)}
            >
              <img
                src={u.profileImage || "/user.svg"}
                className="w-12 h-12 rounded-full border"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#4C3728]">
                  {u.nickname}
                </span>
                {u.bio && (
                  <span className="text-xs text-[#B38A6A] line-clamp-1">
                    {u.bio}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
