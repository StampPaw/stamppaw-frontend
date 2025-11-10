// src/hooks/useKakaoLoaderOnce.js
let loaded = false;

export default function useKakaoLoaderOnce() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  const appkey = import.meta.env.VITE_KAKAO_MAP_KEY;

  if (!appkey) {
    console.error("❌ VITE_KAKAO_MAP_KEY is missing!");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false&libraries=clusterer,drawing,services`;
  script.async = true;

  script.onload = () => {
    console.log("✅ Kakao Maps SDK loaded manually!");
    window.kakao.maps.load(() => {
      console.log("✅ window.kakao.maps.load() complete");
    });
  };

  script.onerror = (e) => {
    console.error("❌ Failed to load Kakao Maps SDK:", e);
  };

  document.head.appendChild(script);
}
