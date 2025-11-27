import { CustomOverlayMap } from "react-kakao-maps-sdk";

export default function ProfileOverlay({ position, imageUrl }) {
  if (!position) return null;

  return (
    <CustomOverlayMap position={position} yAnchor={1}>
      <div
        style={{
          position: "relative",
          transform: "translate(3%, -36%)", //위치보정
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          background: "#fff",
        }}
      >
        <img
          src={imageUrl || "/user.svg"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </CustomOverlayMap>
  );
}
