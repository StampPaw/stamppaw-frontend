import { create } from "zustand";
import { missionService } from "../services/missionService";
import { usePointStore } from "./usePointStore";

export const useMissionStore = create((set, get) => ({
  missions: [],

  // 미션 불러오기 (내 미션)
  fetchMissions: async () => {
    try {
      const data = await missionService.fetchUserMissions();
      set({ missions: data });
    } catch (e) {
      console.error("❌ 미션 불러오기 실패:", e);
    }
  },
  
}));
