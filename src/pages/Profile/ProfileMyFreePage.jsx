import { useEffect, useState } from "react";
import { getMyCommunityPosts } from "@/services/communityService";
import { useNavigate } from "react-router-dom";

export default function ProfileMyFreePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, [page]);

  const fetchMyPosts = async () => {
    try {
      const data = await getMyCommunityPosts(page, 10);
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error("내 자유글 조회 실패:", e);
    }
  };

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-[#8D7B6C] mt-10">
          작성한 게시글이 아직 없어요!
        </p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/community/${post.id}`)}
            className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#F3E9D7] cursor-pointer hover:bg-[#FFF9F2] transition"
          >
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt="thumbnail"
                className="w-24 h-24 object-cover rounded-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-[#F6F2EA] flex items-center justify-center text-sm text-[#B8AFA5]">
                No Image
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-[#4C3928] line-clamp-1">
                  {post.title}
                </h3>
              </div>

              <p className="text-sm text-[#8D7B6C] mt-1 line-clamp-2">
                {post.content}
              </p>

              <div className="flex gap-4 text-xs text-[#B38A6A] mt-2">
                <span>❤️ {post.likeCount ?? 0}</span>
                <span>💬 {post.commentCount ?? 0}</span>
                <span>👀 {post.views ?? 0}</span>
              </div>

              <p className="text-[11px] text-[#C5B8A9] mt-2">
                작성일: {new Date(post.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-4 mt-5">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-[#F4E4C2] rounded disabled:opacity-50"
        >
          이전
        </button>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-[#F4E4C2] rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
