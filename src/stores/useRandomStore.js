// src/stores/useRandomStore.js
import { create } from "zustand";
import { randomService } from "../services/randomService";

export const useRandomStore = create((set, get) => ({
  points: [],
  prevPoints: [],
  userLocation: null,
  loading: false,

  // ⭐ 최초 1회 가져오기만 API 호출 허용
  fetchPoints: async () => {
    set({ loading: true });
    try {
      const pts = await randomService.fetchRandomPoints();
      set({
        points: pts,
        prevPoints: pts,
      });
    } finally {
      set({ loading: false });
    }
  },

  // ⭐ 위치 업데이트 (store only)
  setUserLocation: (lat, lng, time) =>
    set({
      userLocation: { lat, lng, time },
    }),

  // ⭐ 서버에서 새로운 랜덤 포인트를 전달받았을 때만 업데이트
  updatePointsFromServer: (newPoints) => {
    const prev = get().points;
    set({
      points: newPoints,
      prevPoints: prev,
    });
  },
}));
