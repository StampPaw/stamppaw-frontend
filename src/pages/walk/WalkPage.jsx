import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { Crosshair } from "lucide-react";
import useKakaoLoaderOnce from "../../hooks/useKakaoLoaderOnce";
import { walkService } from "../../services/walkService";
import AlertToast from "../../components/ui/AlertToast";
import BottomSheet from "../../components/walk/BottomSheet";

export default function WalkPage() {
  useKakaoLoaderOnce();

  const [stage, setStage] = useState("idle");
  const [walkId, setWalkId] = useState(null);
  const [path, setPath] = useState([]);
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 }); // ✅ 지도 중심
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [toast, setToast] = useState("");
  const [sheetHeight, setSheetHeight] = useState(360);

  const watchId = useRef(null);
  const intervalId = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // ✅ 초기 위치 설정
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setPosition(pos);
        setCenter(pos);
      },
      console.error,
      { enableHighAccuracy: true }
    );
  }, []);

  // ✅ 거리 계산
  const calcDist = (a, b, c, d) => {
    const R = 6371e3;
    const rad = (x) => (x * Math.PI) / 180;
    const φ1 = rad(a),
      φ2 = rad(c),
      Δφ = rad(c - a),
      Δλ = rad(d - b);
    const A =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  };

  // ✅ 경과시간 업데이트
  useEffect(() => {
    if (stage !== "walking") return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((new Date() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, startTime]);

  // ✅ 내 위치로 부드럽게 이동
  const recenterToMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newPos = { lat: coords.latitude, lng: coords.longitude };
        setPosition(newPos);

        // 즉시 중심 변경
        setCenter(newPos);

        // 부드럽게 보간 이동 (lerp)
        let step = 0;
        const steps = 5; // 프레임 수
        const interval = setInterval(() => {
          step++;
          setCenter((prev) => ({
            lat: prev.lat + (newPos.lat - prev.lat) * 0.2,
            lng: prev.lng + (newPos.lng - prev.lng) * 0.2,
          }));
          if (step >= steps) clearInterval(interval);
        }, 100);

        setToast("📍 현위치로 이동했습니다!");
      },
      () => setToast("🚨 위치 정보를 불러올 수 없습니다."),
      { enableHighAccuracy: true }
    );
  };

  // ✅ 산책 시작
  const startWalk = async () => {
    if (!position) return;
    try {
      const res = await walkService.startWalk({
        lat: position.lat,
        lng: position.lng,
        timestamp: new Date().toISOString(),
      });
      setWalkId(res.id);
      setStage("walking");
      setStartTime(new Date());
      setPath([{ lat: position.lat, lng: position.lng }]);

      watchId.current = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const np = { lat: coords.latitude, lng: coords.longitude };
          setPosition(np);
          setPath((prev) => {
            if (prev.length)
              setDistance(
                (d) =>
                  d + calcDist(prev.at(-1).lat, prev.at(-1).lng, np.lat, np.lng)
              );
            return [...prev, np];
          });
        },
        console.error,
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      intervalId.current = setInterval(async () => {
        if (!walkId || !position) return;
        try {
          await walkService.addPoint(walkId, {
            lat: position.lat,
            lng: position.lng,
            timestamp: new Date().toISOString(),
          });
        } catch (err) {
          console.warn("🚨 위치 전송 실패:", err);
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      setToast("🚨 산책을 시작할 수 없습니다.");
    }
  };

  // ✅ 산책 종료
  const endWalk = async () => {
    if (!walkId) return;
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    if (intervalId.current) clearInterval(intervalId.current);
    setStage("finished");
    try {
      await walkService.endWalk(walkId, {
        lat: position.lat,
        lng: position.lng,
        timestamp: new Date().toISOString(),
        memo,
      });
    } catch (err) {
      console.error("🚨 종료 실패:", err);
    }
  };

  // ✅ 산책 기록 저장
  const recordWalk = async () => {
    if (!walkId) return;
    const formData = new FormData();
    formData.append("memo", memo);
    if (photo && photo.length > 0) {
      for (let i = 0; i < photo.length; i++) {
        formData.append("photos", photo[i]);
      }
    }

    try {
      await walkService.recordWalk(walkId, formData);
      setToast("✅ 산책 기록이 저장되었습니다!");
      setStage("recorded");
      setTimeout(() => navigate(`/walk/${walkId}`), 2000);
    } catch (err) {
      console.error(err);
      setToast("🚨 기록 저장 실패");
    }
  };

  if (typeof window.kakao === "undefined")
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        🌀 Kakao 지도 로드 중...
      </div>
    );

  return (
    <div className="relative w-full h-screen">
      {/* ✅ 지도 */}
      <Map
        center={center}
        level={3}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
      >
        {position && (
          <MapMarker
            position={position}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
              size: { width: 40, height: 42 },
            }}
          />
        )}
        {path.length > 1 && (
          <Polyline
            path={path}
            strokeWeight={5}
            strokeColor="#FF9F43"
            strokeOpacity={0.8}
            strokeStyle="solid"
          />
        )}
      </Map>

      {/* ✅ 내 위치 버튼 */}
      <button
        onClick={recenterToMyLocation}
        className="fixed bottom-[420px] right-5 z-[9999] bg-white/95 backdrop-blur-sm border border-border shadow-xl rounded-full w-12 h-12 flex items-center justify-center hover:bg-orange-50 active:scale-95 transition"
        title="내 위치로 이동"
      >
        <Crosshair className="w-6 h-6 text-[#FF9F43]" strokeWidth={2.5} />
      </button>

      {/* ✅ 바텀 시트 */}
      <div className="absolute bottom-0 left-0 w-full translate-y-[-60px] z-40">
        <BottomSheet
          stage={stage}
          elapsed={elapsed}
          distance={distance}
          memo={memo}
          setMemo={setMemo}
          photo={photo}
          setPhoto={setPhoto}
          startWalk={startWalk}
          endWalk={endWalk}
          recordWalk={recordWalk}
          onHeightChange={setSheetHeight}
        />
      </div>

      <AlertToast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
