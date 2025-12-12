import { create } from 'zustand'
import axios from 'axios'

export const useRetirementStore = create((set) => ({
  retirementData: [],
  retiredCount: 0,
  eligibleCount: 0,
  resignationCount: 0,

  fetchRetirements: async (API_URL) => {
    try {
      const res = await axios.get(`${API_URL}/retirement/`);

      set({
        retirementData: res.data.data,
        retiredCount: res.data.retired_count,
        eligibleCount: res.data.over60_active_count,
        resignationCount: res.data.resigned_count,
      });
    } catch (err) {
      console.error("Error fetching retirement data:", err);
    }
  },
}));
