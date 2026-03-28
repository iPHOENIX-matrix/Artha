import { create } from "zustand";

interface FinanceState {
  refreshKey: number;
  refresh: () => void;

  page: "dashboard" | "accounts" | "credit" | "transactions" | "fds";
  setPage: (page: FinanceState["page"]) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  refreshKey: 0,
  refresh: () => set((s) => ({ refreshKey: s.refreshKey + 1 })),

  page: "dashboard", // ✅ default set to dashboard
  setPage: (page) => set({ page }),
}));