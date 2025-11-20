import { MapMarker } from "react-kakao-maps-sdk";
import { useMemo } from "react";
import { useRandomStore } from "../../stores/useRandomStore";
import { useWalkStore } from "../../stores/useWalkStore";

function calcDist(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const rad = (x) => (x * Math.PI) / 180;

  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const FADE_RADIUS = 300;
const CLEAR_RADIUS = 100;
const REMOVE_RADIUS = 30;

export default function RandomPointMarkers({ userLocation }) {
  const points = useRandomStore((s) => s.points);
  const prevPoints = useRandomStore((s) => s.prevPoints);

  const isWalking = useWalkStore((s) => s.isWalking);

  if (!userLocation) return null;

  const { added, removed, distanceMap } = useMemo(() => {
    const distanceMap = new Map();

    points.forEach((p) => {
      const dist = calcDist(userLocation.lat, userLocation.lng, p.lat, p.lng);
      distanceMap.set(`${p.lat},${p.lng}`, dist);
    });

    const prevMap = new Map(prevPoints.map((p) => [`${p.lat},${p.lng}`, p]));
    const currMap = new Map(points.map((p) => [`${p.lat},${p.lng}`, p]));

    const added = points.filter((p) => !prevMap.has(`${p.lat},${p.lng}`));
    const removed = prevPoints.filter((p) => !currMap.has(`${p.lat},${p.lng}`));

    return { added, removed, distanceMap };
  }, [points, prevPoints, userLocation]);

  return (
    <>
      {/* ✅ normal: 거리 조건 없이 전부 동일 스타일 */}
      {points.map((p, i) => (
        <AnimatedMarker
          key={`nm-${i}`}
          point={p}
          type="normal"
          opacity={1}
        />
      ))}

      {/* ➕ added */}
      {added.map((p, i) => {
        const dist = distanceMap.get(`${p.lat},${p.lng}`);
        return (
          <AnimatedMarker
            key={`add-${i}`}
            point={p}
            type="added"
            opacity={dist <= CLEAR_RADIUS ? 1 : 0.5}
          />
        );
      })}

      {/* ➖ removed */}
      {removed.map((p, i) => (
        <AnimatedMarker
          key={`rm-${i}`}
          point={p}
          type="removed"
          opacity={1}
        />
      ))}
    </>
  );
}

function AnimatedMarker({ point, type, opacity }) {
  let style = { opacity };

  if (type === "added") {
    style.animation = "popAnim 0.3s ease-out";
  } else if (type === "removed") {
    style.animation = "fadeOut 0.4s ease-out forwards";
  }

  const icon = "/walk/coin.png";

  return (
    <MapMarker
      position={{ lat: point.lat, lng: point.lng }}
      image={{
        src: icon,
        size: { width: 30, height: 30 },
      }}
      style={style}
    />
  );
}
