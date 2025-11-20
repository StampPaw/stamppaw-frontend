// // src/stores/walkStore.js
// import { create } from "zustand";
// import { walkService } from "../services/walkService";

// // ⭐ UTC → KST 변환 후 LocalDateTime 형태로 포맷
// export const toLocalTimestamp = () => {
//   const now = new Date();
//   const offsetMs = now.getTimezoneOffset() * 60000;
//   const local = new Date(now.getTime() - offsetMs);
//   return local.toISOString().slice(0, 19);
// };

// export const useWalkStore = create((set, get) => ({
//   // --- State ---
//   walkList: [],
//   walkId: null,
//   isWalking: false,
//   isLoading: false,
//   isLastPage: false,
//   totalPages: 0,
//   currentPage: 0,
//   path: [],
//   distance: 0,
//   duration: 0,
//   walk: null,
//   error: null,

//   // ===============================
//   // 🚶 산책 시작
//   // ===============================
//   startWalk: async (lat, lng) => {
//     try {
//       const timestamp = toLocalTimestamp();
//       const data = await walkService.startWalk({ lat, lng, timestamp });
//       set({
//         isWalking: true,
//         walkId: data.id,
//         path: [{ lat, lng, timestamp }],
//         walkData: data,
//       });
//     } catch (err) {
//       set({ error: err.message });
//       console.error("🚨 Failed to start walk:", err);
//     }
//   },

//   // ===============================
//   // 📍 위치 저장
//   // ===============================
//   addPoint: async (lat, lng) => {
//     const { walkId, path } = get();
//     if (!walkId) return;

//     const newPoint = { lat, lng, timestamp: toLocalTimestamp() };
//     try {
//       await walkService.addPoint(walkId, newPoint);
//       set({ path: [...path, newPoint] });
//     } catch (err) {
//       console.error("🚨 Failed to add point:", err);
//     }
//   },

//   // ===============================
//   // ⛔ 산책 종료
//   // ===============================
//   endWalk: async (lat, lng) => {
//     const { walkId } = get();
//     if (!walkId) return;

//     try {
//       const timestamp = toLocalTimestamp();
//       const data = await walkService.endWalk(walkId, { lat, lng, timestamp });
//       set({
//         isWalking: false,
//         walkData: data,
//         distance: data.distance,
//         duration: data.duration,
//       });

//       const fetchMissions = useMissionStore.getState().fetchMissions;
//       fetchMissions();
//     } catch (err) {
//       set({ error: err.message });
//       console.error("🚨 Failed to end walk:", err);
//     }
//   },

//   // ===============================
//   // 📝 기록 수정(메모·사진)
//   // ===============================
//   recordWalk: async (walkId, formData) => {
//     try {
//       const data = await walkService.recordWalk(walkId, formData);
//       set({ walk: data });
//       return data;
//     } catch (err) {
//       console.error("🚨 Failed to record walk:", err);
//       throw err;
//     }
//   },

//   // ===============================
//   // 🔍 상세 조회
//   // ===============================
//   fetchWalkDetail: async (walkId) => {
//     try {
//       const data = await walkService.getWalkDetail(walkId);
//       set({ walk: data, path: data.points || [] });
//     } catch (err) {
//       set({ error: err.message });
//       console.error("🚨 Failed to fetch walk detail:", err);
//     }
//   },

//   // ===============================
//   // ⭐ 내 산책 목록 (/api/walks/my)
//   // ===============================
//   fetchMyWalks: async (page = 0, size = 12, append = false) => {
//     const { isLoading, isLastPage } = get();
//     if (isLoading || (append && isLastPage)) return;

//     set({ isLoading: true });

//     try {
//       const { content, totalPages, currentPage, last } =
//         await walkService.getMyWalks(page, size);

//       set((state) => ({
//         walkList: append ? [...state.walkList, ...content] : content,
//         totalPages,
//         currentPage,
//         isLastPage: last,
//       }));
//     } catch (err) {
//       set({ error: err.message });
//       console.error("🚨 Failed to fetch my walks:", err);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ===============================
//   // ⭐ 다른 사용자 산책 (/api/walks/user/{id})
//   // ===============================
//   fetchWalksByUser: async (userId, page = 0, size = 12, append = false) => {
//     const { isLoading, isLastPage } = get();
//     if (isLoading || (append && isLastPage)) return;

//     set({ isLoading: true });

//     try {
//       const { content, totalPages, currentPage, last } =
//         await walkService.getWalksByUser(userId, page, size);

//       set((state) => ({
//         walkList: append ? [...state.walkList, ...content] : content,
//         totalPages,
//         currentPage,
//         isLastPage: last,
//       }));
//     } catch (err) {
//       set({ error: err.message });
//       console.error("🚨 Failed to fetch user's walks:", err);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ===============================
//   // ♻ 목록 초기화
//   // ===============================
//   resetWalkList: () =>
//     set({
//       walkList: [],
//       currentPage: 0,
//       totalPages: 0,
//       isLastPage: false,
//       isLoading: false,
//     }),

//   // ===============================
//   // ♻ 전체 초기화
//   // ===============================
//   resetAll: () =>
//     set({
//       walkList: [],
//       walkId: null,
//       isWalking: false,
//       isLoading: false,
//       isLastPage: false,
//       totalPages: 0,
//       currentPage: 0,
//       path: [],
//       distance: 0,
//       duration: 0,
//       walkData: null,
//       error: null,
//     }),
// }));
