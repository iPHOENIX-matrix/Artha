import {
  Home,
  Landmark,
  CreditCard,
  ArrowLeftRight,
  Target,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function BottomNav() {
  const page = useFinanceStore((s) => s.page);
  const setPage = useFinanceStore((s) => s.setPage);

  const isModalOpen = useFinanceStore((s) => s.isModalOpen);

  if (isModalOpen) return null;

  const navItems = [
    {
      key: "accounts",
      icon: Landmark, // ✅ moved here (bank feel)
    },
    {
      key: "credit",
      icon: CreditCard,
    },
    {
      key: "dashboard",
      icon: Home,
    },
    {
      key: "planner", // ✅ NEW (replaces FDs)
      icon: Target, // 🎯 premium icon
    },
    {
      key: "transactions",
      icon: ArrowLeftRight,
    },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 max-w-md mx-auto px-3 z-50">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-2xl px-3 py-3 flex justify-between">
        {navItems.map(({ key, icon: Icon }) => {
          const active = page === key;

          return (
            <button
              key={key}
              onClick={() => setPage(key as any)}
              className={`relative flex items-center justify-center rounded-2xl p-3 transition-all duration-300 active:scale-90 ${
                active
                  ? "bg-gradient-to-br from-violet-600 to-blue-500 shadow-lg shadow-violet-500/20"
                  : "hover:bg-zinc-800"
              }`}
            >
              <Icon
                size={20}
                className={`transition-all ${
                  active ? "text-white" : "text-zinc-400"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}