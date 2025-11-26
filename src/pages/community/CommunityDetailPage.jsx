// src/pages/community/CommunityDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash, Heart } from "lucide-react";

import UserAvatar from "../../components/ui/UserAvatar";
import UserProfileLink from "../../components/common/UserProfileLink";

import {
  getCommunityDetail,
  deleteCommunity,
} from "../../services/communityService";

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../services/commentService";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const currentUserId = Number(JSON.parse(localStorage.getItem("user"))?.id);
  const fetchedRef = useRef(false);

  const handleToggleLike = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/community/${id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setCommunity((prev) => ({
        ...prev,
        likeCount: data.likeCount,
        liked: data.isLiked,
      }));
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const loadData = async () => {
      try {
        // 📌 게시글 상세 (axios)
        const post = await getCommunityDetail(id);
        setCommunity(post);

        // 📌 댓글 조회 (fetch)
        const commentPage = await getComments(id, 0, 10);
        setComments(commentPage.content);
      } catch (err) {
        console.error("불러오기 실패:", err);
      }
    };

    loadData();
  }, []);

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return alert("댓글을 입력하세요.");

    await createComment({
      communityId: Number(id),
      content: newComment,
    });

    const refreshed = await getComments(id, 0, 10);
    setComments(refreshed.content);

    setNewComment("");
  };

  if (!community)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        불러오는 중...
      </div>
    );

  // Recursive comment renderer
  const renderComment = (comment, depth) => {
    return (
      <div
        className="border-b border-gray-100 py-3"
        style={{ marginLeft: depth * 16 }}
      >
        <div className="flex items-center mb-1">
          <UserAvatar image={comment.profileImage} size="sm" />
          <span className="ml-2 font-medium">{comment.nickname}</span>
        </div>
        <p className="ml-1 text-gray-700">{comment.content}</p>

        <div className="flex items-center gap-3 ml-1 mt-1">
          <button
            onClick={() =>
              setReplyTargetId(replyTargetId === comment.id ? null : comment.id)
            }
            className="text-xs text-blue-500 hover:underline"
          >
            답글
          </button>

          {Number(
            localStorage.getItem("user") &&
              JSON.parse(localStorage.getItem("user")).id
          ) === comment.userId && (
            <button
              className="text-gray-400 hover:text-red-500 ml-auto"
              onClick={async () => {
                await deleteComment(comment.id);
                const refreshed = await getComments(id, 0, 10);
                setComments(refreshed.content);
              }}
            >
              <Trash size={16} />
            </button>
          )}
        </div>

        {/* 수정 입력창 */}
        {editingCommentId === comment.id && (
          <div className="mt-2 ml-2 flex gap-2">
            <input
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-gray-300"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
            />
            <button
              onClick={async () => {
                await updateComment(comment.id, { content: editingContent });
                const refreshed = await getComments(id, 0, 10);
                setComments(refreshed.content);
                setEditingCommentId(null);
                setEditingContent("");
              }}
              className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
            >
              저장
            </button>
          </div>
        )}

        {replyTargetId === comment.id && (
          <div className="mt-2 ml-2 flex gap-2">
            <input
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-gray-300"
              placeholder="답글을 입력하세요..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <button
              onClick={async () => {
                await createComment({
                  communityId: Number(id),
                  parentId: comment.id,
                  content: replyContent,
                });

                const refreshed = await getComments(id, 0, 10);
                setComments(refreshed.content);

                setReplyContent("");
                setReplyTargetId(null);
              }}
              className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
            >
              등록
            </button>
          </div>
        )}

        {comment.children &&
          comment.children.length > 0 &&
          comment.children.map((child) => (
            <React.Fragment key={child.id}>
              {renderComment(child, depth + 1)}
            </React.Fragment>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] flex flex-col relative mx-auto h-screen bg-[#FFF8EE]">
        {/* 상단 헤더 */}
        <div className="sticky top-0 bg-[#FFF8EE] z-30 flex items-center gap-3 p-4 shadow-sm border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="text-gray-700" size={22} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            커뮤니티 글 상세보기
          </h2>
        </div>

        {/* 내용 영역 */}
        <main className="flex-1 overflow-y-auto pb-28 bg-[#FFF8EE]">
          {/* 이미지 */}
          <div className="px-4 pt-6">
            {community.imageUrl && (
              <img
                src={community.imageUrl}
                alt={community.title}
                className="w-full h-auto max-h-[600px] object-contain mb-5 rounded-md"
              />
            )}
          </div>

          {/* 본문 카드 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mx-4 mt-4">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {community.title}
            </h1>

            {/* 작성자 */}
            <div className="mb-4 flex flex-col gap-2 text-sm text-gray-500">
              <UserProfileLink userId={community.user.id}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <UserAvatar image={community.user.image} size="md" />
                  <span className="font-medium">{community.user.nickname}</span>
                </div>
              </UserProfileLink>

              <span>
                {new Date(community.registeredAt).toLocaleString("ko-KR")}
              </span>
              {/* <span>조회수 {community.views}</span> */}
            </div>

            {/* 내용 */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {community.content}
            </p>

            {/* 수정 / 삭제 */}
            {currentUserId === community.user.id && (
              <div className="flex items-center gap-2 mt-6">
                <button
                  onClick={() => navigate(`/community/edit/${id}`)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Pencil size={20} />
                </button>

                <button
                  className="text-gray-400 hover:text-red-500"
                  onClick={async () => {
                    if (!window.confirm("삭제하시겠습니까?")) return;
                    await deleteCommunity(id);
                    navigate("/community");
                  }}
                >
                  <Trash size={20} />
                </button>
              </div>
            )}

            {/* 좋아요 버튼 */}
            <div className="mt-4 flex items-center gap-2">
              <button
                disabled={!localStorage.getItem("token")}
                onClick={handleToggleLike}
                className={`flex items-center gap-1 ${
                  !localStorage.getItem("token")
                    ? "opacity-50 cursor-not-allowed"
                    : community.liked
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                <Heart
                  size={22}
                  className={
                    community.liked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500"
                  }
                />
                <span className="text-sm">{community.likeCount}</span>
              </button>
            </div>

            {/* 댓글 섹션 */}
            <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">댓글</h2>

              {/* 댓글 입력창 */}
              <div className="flex gap-2 mb-4">
                <input
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-gray-300"
                  placeholder="댓글을 입력하세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={handleSubmitComment}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  등록
                </button>
              </div>

              {/* 댓글 리스트 */}
              {comments.length === 0 ? (
                <p className="text-gray-500">아직 댓글이 없습니다.</p>
              ) : (
                comments.map((c) => <div key={c.id}>{renderComment(c, 0)}</div>)
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
