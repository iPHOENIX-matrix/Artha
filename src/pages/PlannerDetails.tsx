import { useEffect, useState } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import {
  getPlans,
  getPlanTransactions,
} from "../services/planService";
import { getAccounts } from "../services/accountService";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Wallet,
  Landmark,
} from "lucide-react";

export default function PlannerDetails() {
  const setPage = useFinanceStore((s) => s.setPage);

  const [plans, setPlans] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [transactionsMap, setTransactionsMap] = useState<Record<string, any[]>>(
    {}
  );

  useEffect(() => {
    const load = async () => {
      const plansData = await getPlans();
      const accs = await getAccounts();

      setPlans(plansData);
      setAccounts(accs);

      const map: Record<string, any[]> = {};

      for (const p of plansData) {
        const txns = await getPlanTransactions(p.id);
        map[p.id] = txns;
      }

      setTransactionsMap(map);
    };

    load();
  }, []);

  const total = plans.reduce((acc, p) => acc + p.savedAmount, 0);

  const toggle = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* 🔥 PREMIUM HEADER */}
      <div className="flex items-center justify-between">
        {/* LEFT: TITLE */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              All Goals
            </span>
          </h1>
        </div>

        <button
          onClick={() => setPage("planner")}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* 💰 TOTAL CARD */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 rounded-2xl border border-zinc-700 shadow-md">
        <p className="text-sm text-zinc-400">Total Saved</p>
        <p className="text-2xl font-bold text-green-400 mt-1">
          ₹{total.toLocaleString()}
        </p>
      </div>

      {/* 📂 GOALS */}
      {plans.map((p) => {
        const txns = transactionsMap[p.id] || [];

        const progress =
          (p.savedAmount / p.targetAmount) * 100 || 0;

        // 🏦 BANK BREAKDOWN
        const bankMap: Record<string, number> = {};

        txns.forEach((t: any) => {
          if (!bankMap[t.bankAccountId]) bankMap[t.bankAccountId] = 0;

          if (t.type === "SAVE") bankMap[t.bankAccountId] += t.amount;
          else bankMap[t.bankAccountId] -= t.amount;
        });

        return (
          <div
            key={p.id}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 rounded-2xl border border-zinc-700 shadow-sm transition"
          >
            {/* 🎯 TITLE ROW */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggle(p.id)}
            >
              <div>
                <p className="font-semibold flex items-center gap-2">
                  <Wallet size={16} /> {p.title}
                </p>

                <p className="text-sm text-zinc-400">
                  ₹{p.savedAmount.toLocaleString()} / ₹
                  {p.targetAmount.toLocaleString()}
                </p>
              </div>

              <div className="text-zinc-400">
                {expanded === p.id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </div>

            {/* 📊 PROGRESS BAR */}
            <div className="mt-3">
              <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <p className="text-xs text-purple-400 mt-1">
                {progress.toFixed(1)}% achieved
              </p>
            </div>

            {/* 📂 DROPDOWN */}
            {expanded === p.id && (
              <div className="space-y-4 mt-4 border-t border-zinc-700 pt-4 animate-fadeIn">
                {/* 🏦 BANK BREAKDOWN */}
                <div>
                  <p className="text-xs text-zinc-400 mb-2 flex items-center gap-1">
                    <Landmark size={14} /> Bank Breakdown
                  </p>

                  {Object.entries(bankMap).map(
                    ([bankId, amt]) => {
                      const bank = accounts.find(
                        (a) => a.id === bankId
                      );

                      return (
                        <div
                          key={bankId}
                          className="flex justify-between items-center bg-zinc-800 p-2 rounded-lg mb-2"
                        >
                          <span className="text-sm">
                            {bank?.name || "Unknown"}
                          </span>

                          <span
                            className={`text-sm font-semibold ${
                              amt >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            ₹{amt}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* 📜 TRANSACTIONS */}
                <div>
                  <p className="text-xs text-zinc-400 mb-2">
                    Transactions
                  </p>

                  {txns.map((t) => {
                    const bank = accounts.find(
                      (a) => a.id === t.bankAccountId
                    );

                    return (
                      <div
                        key={t.id}
                        className="flex justify-between items-center bg-zinc-800 p-3 rounded-xl mb-2"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {bank?.name}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {new Date(
                              t.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>

                        <p
                          className={`font-semibold ${
                            t.type === "SAVE"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {t.type === "SAVE" ? "+" : "-"} ₹
                          {t.amount}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}