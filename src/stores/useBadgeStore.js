import { create } from "zustand";
import { badgeService } from "../services/badgeService";

export const useBadgeStore = create((set, get) => ({
  badges: [],
  representative: null,

  fetchBadges: async () => {
    const data = await badgeService.getMyBadges();

    // console.log("badge data:", data); 

    const rep = data.find((b) => b.representative);

    set({
      badges: data,
      representative: rep ? rep.badgeId : null,
    });
  },

  setRepresentative: async (badgeId) => {
    await badgeService.setRepresentative(badgeId);
    await get().fetchBadges();
  },

  clearRepresentative: async () => {
    await badgeService.clearRepresentative();
    await get().fetchBadges();
  },
}));
