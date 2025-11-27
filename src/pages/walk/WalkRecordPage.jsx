import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Ruler, Check, X, Pencil, Trash2, Plus } from "lucide-react";
import { Map, MapMarker, Polyline, useKakaoLoader } from "react-kakao-maps-sdk";
import { walkService } from "../../services/walkService";

export default function WalkDetailPage() {
  const { walkId } = useParams();
  const navigate = useNavigate();

  const [walk, setWalk] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState([]); // 기존 사진 + 새 파일
  const [deleted, setDeleted] = useState([]); // 삭제한 기존 사진 URLs
  const [toast, setToast] = useState("");
  const textareaRef = useRef(null);

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await walkService.getWalkDetail(walkId);
        setWalk(data);
        setMemo(data.memo || "");
        setPhoto(data.photoUrls || []);
      } catch (err) {
        console.error("🚨 산책 상세 조회 실패:", err);
        setToast("산책 기록을 불러오지 못했습니다 ❌");
      }
    })();
  }, [walkId]);

  const handleMemoChange = (e) => {
    const value = e.target.value;
    setMemo(value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto";

    const lineHeight = 20; // 1줄 높이(px) — Tailwind 기본 text-base 기준
    const maxHeight = lineHeight * 10; // 최대 10줄

    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}시간 ${m}분 ${s}초`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
  };

  const formatDistance = (meters) => {
    if (!meters || meters <= 0) return "0m";

    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }

    return `${(meters / 1000).toFixed(2)} km`;
  };

  // ===========================
  // 🗑 삭제
  // ===========================
  const handleDeleteWalk = async () => {
    if (!window.confirm("정말 삭제하시겠어요?")) return;

    try {
      await walkService.deleteWalk(walkId);
      setToast("삭제되었습니다 🗑️");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("삭제 실패:", err);
      setToast("삭제 중 오류 발생 ❌");
    }
  };

  // ===========================
  // 💾 수정 저장
  // ===========================
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("memo", memo);

    // ⚡ File만 서버로 전송 → 기존 URL은 전송하지 않음
    photo.forEach((p) => {
      if (p instanceof File) {
        formData.append("photos", p);
      }
    });

    try {
      await walkService.recordWalk(walkId, formData);

      setToast("수정 완료되었습니다 ✅");
      setIsEditing(false);

      // 최신 데이터 다시 불러오기
      const updated = await walkService.getWalkDetail(walkId);
      setWalk(updated);
      setPhoto(updated.photoUrls || []); // 저장된 새 URL로 덮어쓰기
    } catch (err) {
      console.error("수정 실패:", err);
      setToast("수정 중 오류 발생 ❌");
    }
  };

  // ===========================
  // 📸 사진 추가
  // ===========================
  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    setPhoto((prev) => [...prev, ...files]);
  };

  // ===========================
  // 📸 기존 사진 삭제
  // ===========================
  const handleDeletePhoto = (item) => {
    // 기존 사진 URL 삭제
    if (typeof item === "string") {
      setDeleted((prev) => [...prev, item]);
      setPhoto((prev) => prev.filter((p) => p !== item));
      return;
    }

    // 새로 업로드한 사진 삭제
    setPhoto((prev) => prev.filter((p) => p !== item));
  };

  if (!walk) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        로딩 중...
      </div>
    );
  }

  const points = walk.points || walk.walkPoints || [];
  const hasPoints = points.length > 0;
  const center = hasPoints
    ? { lat: points[0].lat, lng: points[0].lng }
    : { lat: 37.5665, lng: 126.978 };

  return (
    <div className="min-h-screen bg-bg text-gray-800 pb-10">
      <div className="max-w-[600px] mx-auto px-6 pt-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">🐾 산책 기록</h1>

          {/* 버튼 */}
          <div className="flex gap-3 ">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 text-green-600 hover:text-green-800"
                >
                  <Check className="w-6 h-6" />
                  {/* 저장 */}
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false);
                    setDeleted([]);
                  }}
                  className="flex items-center gap-1 text-[#9f9f9f] hover:text-[#828282]"
                >
                  <X className="w-6 h-6" />
                  {/* 취소 */}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-primary hover:text-[#e48c3a]"
                >
                  <Pencil className="w-5 h-5" />
                  {/* 수정 */}
                </button>

                <button
                  onClick={handleDeleteWalk}
                  className="flex items-center gap-1 text-[#9f9f9f] hover:text-[#828282]"
                >
                  <Trash2 className="w-5 h-5" />
                  {/* 삭제 */}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 거리 & 시간 */}
        <div className="flex flex-wrap gap-6 items-center justify-start mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <p className="font-medium">{formatDuration(walk.duration || 0)}</p>
          </div>

          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            <p className="font-medium">{formatDistance(walk.distance)}</p>
          </div>
        </div>

        {/* 지도 */}
        {hasPoints && (
          <div className="w-full h-[300px] rounded-xl overflow-hidden mb-6">
            <Map
              center={center}
              level={4}
              style={{ width: "100%", height: "100%" }}
            >
              <Polyline
                path={points.map((p) => ({ lat: p.lat, lng: p.lng }))}
                strokeWeight={5}
                strokeColor="#FF9F43"
                strokeOpacity={0.8}
              />
              <MapMarker
                position={points[0]}
                image={{
                  src: "/walk/marker-start.png",
                  size: { width: 32, height: 36 },
                }}
              />
              <MapMarker
                position={points[points.length - 1]}
                image={{
                  src: "/walk/marker-end.png",
                  size: { width: 32, height: 36 },
                }}
              />
            </Map>
          </div>
        )}

        {/* 메모 */}
        <div className="my-6 bg-white shadow-soft rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">메모</h2>

          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={memo}
              onChange={handleMemoChange}
              className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none scrollbar-hide"
            />
          ) : (
            <p className="whitespace-pre-line">{walk.memo}</p>
          )}
        </div>

        {/* 사진 */}
        <div className="my-8">
          <h2 className="text-lg font-semibold mb-3">산책 사진</h2>

          <div className="space-y-3">
            {photo.map((item, idx) => (
              <div key={idx} className="relative">
                <img
                  src={
                    typeof item === "string" ? item : URL.createObjectURL(item)
                  }
                  alt="photo"
                  className="w-full aspect-square object-cover rounded-xl"
                />

                {isEditing && (
                  <button
                    onClick={() => handleDeletePhoto(item)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 사진 추가 */}
          {isEditing && (
            <div className="mt-4">
              <label className="block w-full text-center py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-[#FFE8C7] transition">
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-1" />
                  사진 추가하기
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddPhoto}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          )}
        </div>

        {/* 토스트 */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
