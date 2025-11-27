import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { Crosshair, Gift, ListChecks } from "lucide-react";

import useKakaoLoaderOnce from "../../hooks/useKakaoLoaderOnce";
import { walkService } from "../../services/walkService";
import { randomService } from "../../services/randomService";

import BottomSheet from "../../components/walk/BottomSheet";
import AlertToast from "../../components/ui/AlertToast";
import RandomPointMarkers from "../../components/walk/RandomPointMarkers";

import { useRandomStore } from "../../stores/useRandomStore";
import { toLocalTimestamp } from "../../stores/useWalkStore";
import { usePointStore } from "../../stores/usePointStore";
import { getMyInfo } from "../../services/userService";
// import UserMarker from "../../components/walk/UserMarker";
import PointModal from "../../components/walk/PointModal";
import MissionModal from "../../components/walk/MissionModal";
import ProfileOverlay from "../../components/walk/ProfileOverlay";

export default function WalkPage() {
  /** ----------------------------------------
   *  🔧 Hook 최상위 선언
   * ---------------------------------------- */
  useKakaoLoaderOnce();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | walking | finished
  const [walkId, setWalkId] = useState(null);
  const [path, setPath] = useState([]);
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [distance, setDistance] = useState(0);
  const [memo, setMemo] = useState("");
  const [toast, setToast] = useState(null);
  const [locating, setLocating] = useState(true);
  const [openPoint, setOpenPoint] = useState(false);
  const [openMission, setOpenMission] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [photo, setPhoto] = useState([]);

  const mapRef = useRef(null);
  const watchId = useRef(null);
  const idleOnceRef = useRef(false);
  const lastSentPos = useRef(null);
  const lastRandomPos = useRef(null);

  const fetchPoints = useRandomStore((s) => s.fetchPoints);
  const updatePointsFromServer = useRandomStore(
    (s) => s.updatePointsFromServer
  );
  const setUserLocation = useRandomStore((s) => s.setUserLocation);

  const totalPoint = usePointStore((s) => s.total);
  const addReward = usePointStore((s) => s.addReward);
  const fetchTotal = usePointStore((s) => s.fetchTotal);

  const getDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, []);

  const resetPoint = usePointStore((s) => s.reset);

  useEffect(() => {
    resetPoint();
  }, []);

  /** ----------------------------------------
   *  📍 최초 1회 현재 위치 강제 가져오기
   * ---------------------------------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setPosition(pos);
        setCenter(pos);
        setUserLocation(pos.lat, pos.lng, Date.now());
        setLocating(false);
      },
      (err) => console.error("초기 위치 실패:", err),
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 5000,
      }
    );
  }, []);

  /** ----------------------------------------
   *  ⏱ walking 타이머
   * ---------------------------------------- */
  useEffect(() => {
    if (stage !== "walking") return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);

  /** ----------------------------------------
   *  🎯 초기 페이지 렌더링: toast + 포인트
   * ---------------------------------------- */
  useEffect(() => {
    // setToast({
    //   message: "현위치를 찾는 중입니다...",
    //   auto: false,
    //   onClose: () => setToast(null),
    // });
    fetchTotal();
  }, []);

  /** ----------------------------------------
   *  🎯 유저 정보 가져오기
   * ---------------------------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyInfo();
        setUser(data);
      } catch (err) {
        console.error("유저 정보 조회 실패:", err);
      }
    };
    fetchUser();
  }, []);

  /** ----------------------------------------
   *  🎯 랜덤 포인트 최초 불러오기
   * ---------------------------------------- */
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  /** ----------------------------------------
   *  📡 GPS tracking
   * ---------------------------------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setToast("GPS를 지원하지 않는 기기입니다.");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setPosition(pos);
        setUserLocation(pos.lat, pos.lng, Date.now());

        if (locating) {
          setCenter(pos);
          setLocating(false);
        }
        if (stage === "idle") setCenter(pos);
      },
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [locating, stage, setUserLocation]);

  /** ----------------------------------------
   *  🎲 랜덤 포인트 업데이트
   * ---------------------------------------- */
  useEffect(() => {
    if (!position) return;

    const sendRandomUpdate = (pos) => {
      randomService
        .updateLocation({
          lat: pos.lat,
          lng: pos.lng,
          timestampMillis: Date.now(),
          walkId,
        })
        .then((res) => {
          const points = res?.points ?? res;

          if (stage === "walking" && res.reward > 0) {
            setToast(`🎉 +${res.reward}P`);
            setTimeout(() => setToast(null), 2000);
            addReward(res.reward, "RANDOM_POINT_VISIT");
          }

          if (Array.isArray(points)) updatePointsFromServer(points);
          else console.warn("⚠ 예상치 못한 랜덤포인트 응답 구조:", res);
        })
        .catch((err) => console.error("❌ 랜덤포인트 업데이트 오류:", err));
    };

    if (!lastRandomPos.current) {
      lastRandomPos.current = position;
      sendRandomUpdate(position);
      return;
    }

    const dist = getDistance(
      lastRandomPos.current.lat,
      lastRandomPos.current.lng,
      position.lat,
      position.lng
    );
    if (dist < 5) return;

    lastRandomPos.current = position;
    sendRandomUpdate(position);
  }, [position, getDistance, updatePointsFromServer, walkId, stage, addReward]);

  /** ----------------------------------------
   *  🧭 지도 자동 중심 조정
   * ---------------------------------------- */
  useEffect(() => {
    if (stage !== "walking") return;
    if (!mapRef.current || !position) return;

    const map = mapRef.current;
    const proj = map.getProjection();
    const centerPx = proj.pointFromCoords(map.getCenter());
    const userPx = proj.pointFromCoords(
      new kakao.maps.LatLng(position.lat, position.lng)
    );

    if (
      Math.abs(centerPx.x - userPx.x) > 80 ||
      Math.abs(centerPx.y - userPx.y) > 80
    ) {
      map.setCenter(new kakao.maps.LatLng(position.lat, position.lng));
    }
  }, [position, stage]);

  /** ----------------------------------------
   *  🏁 산책 시작
   * ---------------------------------------- */
  const startWalk = async () => {
    if (!position) {
      setToast("현재 위치를 가져오지 못했습니다.");
      return;
    }

    try {
      const res = await walkService.startWalk({
        lat: position.lat,
        lng: position.lng,
        timestamp: toLocalTimestamp(),
      });
      setWalkId(res.id);
      setStage("walking");
      setPath([{ lat: position.lat, lng: position.lng }]);
      lastSentPos.current = position;
    } catch {
      setToast("🚨 산책 시작 실패");
    }
  };

  /** ----------------------------------------
   *  ✏️ 위치 변화 → addPoint + path 업데이트
   * ---------------------------------------- */
  useEffect(() => {
    if (!walkId || stage !== "walking" || !position) return;
    if (!lastSentPos.current) {
      lastSentPos.current = position;
      return;
    }

    const dist = getDistance(
      lastSentPos.current.lat,
      lastSentPos.current.lng,
      position.lat,
      position.lng
    );
    if (dist < 5) return;

    walkService.addPoint(walkId, {
      lat: position.lat,
      lng: position.lng,
      timestamp: toLocalTimestamp(),
    });
    lastSentPos.current = position;

    setPath((prev) => [...prev, position]);
    setDistance((prev) => prev + dist);
  }, [position, walkId, stage, getDistance]);

  /** ----------------------------------------
   *  🛑 산책 종료
   * ---------------------------------------- */
  const endWalk = async () => {
    setStage("finished");
    try {
      await walkService.endWalk(walkId, {
        lat: position.lat,
        lng: position.lng,
        timestamp: toLocalTimestamp(),
        memo,
      });
    } catch {
      setToast("🚨 산책 종료 실패");
    }
  };

  /** ----------------------------------------
   *  📸 산책 기록 저장
   * ---------------------------------------- */
  const recordWalk = async () => {
    if (!walkId) return;
    try {
      const formData = new FormData();
      formData.append("memo", memo);
      photo.forEach((file) => formData.append("photos", file));
      await walkService.recordWalk(walkId, formData);
      setToast("✔️ 산책 기록이 저장되었습니다!");
      navigate(`/walk/${walkId}`);
    } catch {
      setToast("🚨 기록 저장 실패");
    }
  };

  /** ----------------------------------------
   *  📍 현위치 이동
   * ---------------------------------------- */
  const moveToUserLocation = () => {
    if (!position || !mapRef.current) return;
    const latLng = new kakao.maps.LatLng(position.lat, position.lng);
    mapRef.current.setLevel(3);
    mapRef.current.panTo(latLng);
    setCenter(position);
  };

  /** ----------------------------------------
   *  📌 UI 시작
   * ---------------------------------------- */
  if (!user) return <div>로딩 중...</div>;
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 🗺️ 지도 */}
      <div className="absolute inset-0 z-0">
        <Map
          center={center}
          level={3}
          style={{ width: "100%", height: "100%" }}
          onCreate={(map) => {
            mapRef.current = map;

            kakao.maps.event.addListener(map, "idle", () => {
              if (!idleOnceRef.current && !locating) {
                idleOnceRef.current = true;
                setToast(""); // 지도 이동 완료 후 딱 1회만 닫기
              }
            });
          }}
        >
          {/* 사용자 위치 마커 */}
          {position && (
            <>
              <MapMarker
                position={position}
                image={{
                  src: "/walk/marker3.png",
                  size: { width: 70, height: 70 },
                }}
              />

              {/* 🔥 사용자 프로필 오버레이 */}
              <ProfileOverlay
                position={position}
                imageUrl={user?.profileImage}
              />
            </>
          )}

          {position && <RandomPointMarkers userLocation={position} />}

          {path.length > 1 && (
            <Polyline
              path={path}
              strokeWeight={5}
              strokeColor="#FF9F43"
              strokeOpacity={0.85}
            />
          )}
        </Map>
      </div>

      {/* 우측 상단 버튼 */}
      <div className="absolute top-20 right-4 flex gap-3 z-[9999]">
        {/* 포인트 버튼 */}
        <button
          onClick={() => setOpenPoint(true)}
          className="bg-white shadow-md rounded-xl px-3 py-2 flex items-center gap-2"
        >
          <Gift size={20} className="text-yellow-500" />
          <span className="font-semibold">{totalPoint}P</span>
        </button>

        {/* 미션 버튼 */}
        <button
          onClick={() => setOpenMission(true)}
          className="bg-white shadow-md rounded-xl px-3 py-2"
        >
          <ListChecks size={20} className="text-primary" />
        </button>
      </div>

      {/* 모달 */}
      {openPoint && <PointModal onClose={() => setOpenPoint(false)} />}
      {openMission && <MissionModal onClose={() => setOpenMission(false)} />}

      {/* 📍 현위치 버튼 */}
      <div className="absolute top-34 right-4 z-[9999]">
        <button
          className="bg-white shadow p-2 rounded-full"
          onClick={moveToUserLocation}
        >
          <Crosshair size={22} className="text-primary" />
        </button>
      </div>

      {/* 🎛 BottomSheet */}
      <div className="absolute bottom-18 left-0 w-full z-40">
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
        />
      </div>

      {/* 🔔 Toast */}
      <div className="absolute inset-x-0 top-20 z-50">
        <AlertToast message={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
}
