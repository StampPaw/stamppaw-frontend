import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Ruler, MapPin } from "lucide-react";
import { Map, MapMarker, Polyline, useKakaoLoader } from "react-kakao-maps-sdk";
import { walkService } from "../../services/walkService";

export default function WalkDetailPage() {
  const { walkId } = useParams();
  const [walk, setWalk] = useState(null);
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await walkService.getWalkDetail(walkId);
        setWalk(data);
      } catch (err) {
        console.error("🚨 산책 상세 조회 실패:", err);
      }
    })();
  }, [walkId]);

  if (!walk) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        🌀 로딩 중...
      </div>
    );
  }

  const photos = walk.photoUrls || walk.photos || [];
  const points = walk.points || walk.walkPoints || [];
  const hasPoints = points.length > 0;
  const center = hasPoints
    ? { lat: points[0].lat, lng: points[0].lng }
    : { lat: 37.5665, lng: 126.978 };

  return (
    <div className="min-h-screen bg-bg text-gray-800 pb-10">
      <div className="max-w-[600px] mx-auto px-6 pt-8">
        {/* ✅ 기본 정보 */}
        <h1 className="text-2xl font-bold mb-4">🐾 산책 기록</h1>

        <div className="flex flex-wrap gap-6 items-center justify-start mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <p className="font-medium">
              {walk.duration || walk.elapsed || 0}초
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            <p className="font-medium">
              {(walk.distance / 1000).toFixed(2)} km
            </p>
          </div>
        </div>

        {/* ✅ 산책 경로 지도 */}
        {error ? (
          <div className="text-red-500 text-center py-10">❌ 지도 로드 실패</div>
        ) : loading ? (
          <div className="text-center py-10 text-gray-500">🌀 지도 불러오는 중...</div>
        ) : (
          hasPoints && (
            <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-md mb-6">
              <Map
                center={center}
                level={4}
                style={{ width: "100%", height: "100%" }}
              >
                {/* 경로 라인 */}
                <Polyline
                  path={points.map((p) => ({ lat: p.lat, lng: p.lng }))}
                  strokeWeight={5}
                  strokeColor="#FF9F43"
                  strokeOpacity={0.8}
                  strokeStyle="solid"
                />

                {/* 시작 마커 */}
                <MapMarker
                  position={points[0]}
                  image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                    size: { width: 36, height: 36 },
                  }}
                />

                {/* 종료 마커 */}
                <MapMarker
                  position={points[points.length - 1]}
                  image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                    size: { width: 36, height: 36 },
                  }}
                />
              </Map>
            </div>
          )
        )}

        {/* ✅ 시간 정보 */}
        <div className="mt-8 text-sm text-gray-500">
          <p>시작 시간: {new Date(walk.startTime).toLocaleString()}</p>
          <p>종료 시간: {new Date(walk.endTime).toLocaleString()}</p>
        </div>

        {/* ✅ 메모 */}
        {walk.memo && (
          <div className="my-6 bg-white shadow-soft rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2">📝 메모</h2>
            <p className="whitespace-pre-line text-gray-700">{walk.memo}</p>
          </div>
        )}

        {/* ✅ 사진 스크롤 영역 */}
        {photos.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">📸 산책 사진</h2>

            <div className="space-y-3">
              {photos.map((url, idx) => (
                <img
                  key={`${url}-${idx}`}
                  src={url}
                  alt={`walk-photo-${idx}`}
                  className="w-full aspect-square object-cover rounded-xl shadow-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
