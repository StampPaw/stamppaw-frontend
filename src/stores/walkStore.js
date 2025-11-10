// src/store/walkStore.js
import { create } from "zustand";
import { walkService } from "@/services/walkService";

export const useWalkStore = create((set, get) => ({
  // --- State ---
  walkId: null,
  isWalking: false,
  path: [], // [{ lat, lng, timestamp }]
  distance: 0,
  duration: 0,
  walkData: null, // WalkResponse 전체 데이터
  error: null,

  // --- Actions ---

  // ✅ 산책 시작
  startWalk: async (lat, lng) => {
    try {
      const data = await walkService.startWalk({ lat, lng });
      set({
        isWalking: true,
        walkId: data.id,
        path: [{ lat, lng, timestamp: new Date().toISOString() }],
        walkData: data,
      });
      console.log("🐾 Walk started:", data);
    } catch (err) {
      set({ error: err.message });
      console.error("🚨 Failed to start walk:", err);
    }
  },

  // ✅ 좌표 추가 (3초마다 호출)
  addPoint: async (lat, lng) => {
    const { walkId, path } = get();
    if (!walkId) return;

    const newPoint = { lat, lng, timestamp: new Date().toISOString() };

    try {
      await walkService.addPoint(walkId, newPoint);
      set({ path: [...path, newPoint] });
    } catch (err) {
      console.error("🚨 Failed to add point:", err);
    }
  },

  // ✅ 산책 종료
  endWalk: async (lat, lng) => {
    const { walkId } = get();
    if (!walkId) return;

    try {
      const data = await walkService.endWalk(walkId, { lat, lng });
      set({
        isWalking: false,
        walkData: data,
        distance: data.distance,
        duration: data.duration,
      });
      console.log("✅ Walk ended:", data);
    } catch (err) {
      set({ error: err.message });
      console.error("🚨 Failed to end walk:", err);
    }
  },

  // ✅ 메모·사진 기록
  recordWalk: async (memo, photoFile) => {
    const { walkId } = get();
    if (!walkId) return;

    const formData = new FormData();
    if (memo) formData.append("memo", memo);
    if (photoFile) formData.append("photo", photoFile);

    try {
      const data = await walkService.recordWalk(walkId, formData);
      set({ walkData: data });
      console.log("📸 Walk recorded:", data);
    } catch (err) {
      console.error("🚨 Failed to record walk:", err);
    }
  },

  // ✅ 상세 조회
  fetchWalkDetail: async (walkId) => {
    try {
      const data = await walkService.getWalkDetail(walkId);
      set({ walkData: data, path: data.points });
    } catch (err) {
      console.error("🚨 Failed to fetch walk detail:", err);
    }
  },

  // ✅ 상태 초기화
  resetWalk: () =>
    set({
      walkId: null,
      isWalking: false,
      path: [],
      distance: 0,
      duration: 0,
      walkData: null,
      error: null,
    }),
}));
