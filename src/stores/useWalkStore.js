import { create } from "zustand";
import { walkService } from "../services/walkService";

// UTC → KST 변환
export const toLocalTimestamp = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  const local = new Date(now.getTime() - offsetMs);
  return local.toISOString().slice(0, 19);
};

export const useWalkStore = create((set, get) => ({
  walkList: [],
  walkId: null,
  isWalking: false,
  isLoading: false,
  isLastPage: false,
  totalPages: 0,
  currentPage: 0,
  path: [],
  distance: 0,
  duration: 0,
  walk: null,
  error: null,

  // 내 산책 목록 불러오기
  fetchMyWalks: async (page = 0, size = 12, append = false) => {
    try {
      set({ isLoading: true });

      const data = await walkService.getMyWalks(page, size);

      set((state) => ({
        walkList: append ? [...state.walkList, ...data.content] : data.content,
        currentPage: page,
        isLastPage: data.last,
        isLoading: false,
      }));
    } catch (e) {
      console.error("❌ fetchMyWalks 실패:", e);
      set({ isLoading: false });
    }
  },

  // 특정 유저 산책 목록 불러오기
  fetchWalksByUser: async (userId, page = 0, size = 12, append = false) => {
    try {
      set({ isLoading: true });

      const data = await walkService.getWalksByUser(userId, page, size);

      set((state) => ({
        walkList: append ? [...state.walkList, ...data.content] : data.content,
        currentPage: page,
        isLastPage: data.last,
        isLoading: false,
      }));
    } catch (e) {
      console.error("❌ fetchWalksByUser 실패:", e);
      set({ isLoading: false });
    }
  },

  // 산책 시작
  startWalk: async (lat, lng) => {
    try {
      const timestamp = toLocalTimestamp();
      const data = await walkService.startWalk({ lat, lng, timestamp });
      set({
        isWalking: true,
        walkId: data.id,
        path: [{ lat, lng, timestamp }],
        walkData: data,
      });
    } catch (err) {
      set({ error: err.message });
      console.error("🚨 Failed to start walk:", err);
    }
  },

  // 좌표 추가
  addPoint: async (lat, lng) => {
    const { walkId, path } = get();
    if (!walkId) return;

    const newPoint = { lat, lng, timestamp: toLocalTimestamp() };
    try {
      await walkService.addPoint(walkId, newPoint);
      set({ path: [...path, newPoint] });
    } catch (err) {
      console.error("🚨 Failed to add point:", err);
    }
  },

  // 산책 종료
  endWalk: async (lat, lng) => {
    const { walkId } = get();
    if (!walkId) return;

    try {
      const timestamp = toLocalTimestamp();
      const data = await walkService.endWalk(walkId, { lat, lng, timestamp });
      set({
        isWalking: false,
        walkData: data,
        distance: data.distance,
        duration: data.duration,
      });

      const fetchMissions = useMissionStore.getState().fetchMissions;
      fetchMissions();
    } catch (err) {
      set({ error: err.message });
      console.error("🚨 Failed to end walk:", err);
    }
  },

  // 📸 산책 기록 수정 (전체 교체 방식)
  recordWalk: async (walkId, formData) => {
    try {
      const data = await walkService.recordWalk(walkId, formData);
      set({ walk: data });
      return data;
    } catch (err) {
      console.error("🚨 Failed to record walk:", err);
      throw err;
    }
  },

  // 산책 상세 조회
  fetchWalkDetail: async (walkId) => {
    try {
      const data = await walkService.getWalkDetail(walkId);
      set({ walk: data, path: data.points || [] });
    } catch (err) {
      set({ error: err.message });
      console.error("🚨 Failed to fetch walk detail:", err);
    }
  },

  // 전체 산책 목록 조회
  fetchUserWalks: async (page = 0, size = 12, append = false) => {
    const { isLoading, isLastPage } = get();
    if (isLoading || (append && isLastPage)) return;

    set({ isLoading: true });

    try {
      const { content, totalPages, currentPage, last } =
        await walkService.getUserWalks(page, size);

      set((state) => ({
        walkList: append ? [...state.walkList, ...content] : content,
        totalPages,
        currentPage,
        isLastPage: last,
      }));
    } catch (err) {
      set({ error: err.message });
      console.error("🚨 Failed to fetch user walks:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // 삭제
  deleteWalk: async (walkId) => {
    try {
      await walkService.deleteWalk(walkId);
      set({ walk: null });
    } catch (err) {
      console.error("🚨 Failed to delete walk:", err);
      throw err;
    }
  },

  // 산책 상태 초기화
  resetAll: () =>
    set({
      walkList: [],
      walkId: null,
      isWalking: false,
      isLoading: false,
      isLastPage: false,
      totalPages: 0,
      currentPage: 0,
      path: [],
      distance: 0,
      duration: 0,
      walkData: null,
      error: null,
    }),

  // 산책 리스트 상태 초기화
  resetWalkList: () =>
    set({
      walkList: [],
      currentPage: 0,
      isLastPage: false,
      isLoading: false,
    }),
}));
