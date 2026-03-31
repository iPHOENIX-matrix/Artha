import { create } from "zustand";

interface FinanceState {
  refreshKey: number;
  refresh: () => void;

  page:
    | "dashboard"
    | "accounts"
    | "credit"
    | "transactions"
    | "fds"
    | "planner"
    | "plannerDetails"
    | "plannerTracker"
    | "plannerAnalytics"
    | "subs";

  selectedPlanId?: string;

  setPage: (page: FinanceState["page"]) => void;
  setSelectedPlan: (id: string) => void;

  // 🆕 NEW (for modal control)
  isModalOpen: boolean;
  setModalOpen: (val: boolean) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  refreshKey: 0,
  refresh: () =>
    set((s) => ({ refreshKey: s.refreshKey + 1 })),

  page: "dashboard",
  selectedPlanId: undefined,

  setPage: (page) => set({ page }),
  setSelectedPlan: (id) => set({ selectedPlanId: id }),

  // 🆕 NEW
  isModalOpen: false,
  setModalOpen: (val) => set({ isModalOpen: val }),
}));