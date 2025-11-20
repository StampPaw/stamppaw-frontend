import { create } from "zustand";
import { pointService } from "../services/pointService";

export const usePointStore = create((set, get) => ({
  total: 0,
  history: [],
  isLoaded: false,

  /** 🔄 최초 1회 total 조회 */
  fetchTotal: async () => {
    if (get().isLoaded) return;

    try {
      const total = await pointService.getTotal();
      set({ total, isLoaded: true });
    } catch (e) {
      console.error("❌ total 가져오기 실패:", e);
    }
  },

  /** 🔄 강제 total 새로고침 (isLoaded 무시) */
  refreshTotal: async () => {
    try {
      const total = await pointService.getTotal();
      set({ total });
    } catch (e) {
      console.error("❌ total 갱신 실패:", e);
    }
  },

  /** 🎁 포인트 획득 시 */
  addReward: (amount, reason) => {
    set((state) => ({
      total: state.total + amount,
      history: [
        {
          id: Date.now(),
          amount,
          reason,
          timestamp: new Date().toISOString(),
        },
        ...state.history,
      ],
    }));
  },

  /** 📜 포인트 내역 조회 */
  fetchHistory: async () => {
    try {
      const history = await pointService.getHistory();
      set({ history });
    } catch (e) {
      console.error("❌ 포인트 내역 가져오기 실패:", e);
    }
  },

  /** 🚨 로그아웃 or 계정 변경 시 store 초기화 */
  reset: () =>
    set({
      total: 0,
      history: [],
      isLoaded: false,
    }),
}));
