import { useEffect, useState } from "react";
import {
  WalletCards,
  Repeat,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getTransactions } from "../services/transactionService";
import {
  getCreditCards,
  getMonthlyCreditSpendLimit,
} from "../services/accountService";
import { getFDs } from "../services/fdService";
import { calculateTotalBalance } from "../utils/calculations";
import {
  calculateTotalCreditUsed,
  calculateTotalCreditLimit,
  calculateCreditUtilization,
} from "../utils/creditCalculations";
import { useFinanceStore } from "../store/useFinanceStore";
import TransferModal from "../components/accounts/TransferModal";
import SpendModal from "../components/dashboard/SpendModal";

export default function Dashboard() {
  const [netWorth, setNetWorth] = useState(0);
  const [creditUsed, setCreditUsed] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);
  const [plannedLimit, setPlannedLimit] = useState(0);

  const [showTransfer, setShowTransfer] =
    useState(false);
  const [showSpend, setShowSpend] =
    useState(false);

  const refreshKey = useFinanceStore(
    (s) => s.refreshKey
  );

  useEffect(() => {
    const load = async () => {
      const transactions =
        await getTransactions();
      const cards =
        await getCreditCards();
      const fds = await getFDs();
      const monthlyLimit =
        await getMonthlyCreditSpendLimit();

      const totalAssets =
        calculateTotalBalance(
          transactions,
          fds
        );

      const totalCreditUsed =
        calculateTotalCreditUsed(
          transactions
        );

      const totalCreditLimit =
        calculateTotalCreditLimit(
          cards
        );

      setNetWorth(totalAssets);
      setCreditUsed(totalCreditUsed);
      setCreditLimit(totalCreditLimit);
      setPlannedLimit(monthlyLimit);
    };

    load();
  }, [refreshKey]);

  const totalUtilization =
    calculateCreditUtilization(
      creditUsed,
      creditLimit
    );

  const plannedUtilization =
    calculateCreditUtilization(
      creditUsed,
      plannedLimit
    );

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* ✨ HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-5 shadow-xl">
        <div className="absolute inset-0 bg-white/[0.03] blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 tracking-wide">
              Hi Raj 👋
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Welcome to Artha
            </h2>

            <p className="text-sm text-zinc-400 mt-1">
              Your Personal Finance OS 🚀
            </p>
          </div>

          <Sparkles className="text-violet-400" />
        </div>
      </div>

      {/* 💎 NET WORTH */}
      <div className="relative overflow-hidden rounded-3xl p-5 shadow-2xl bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-500">
        <div className="absolute inset-0 bg-white/10 blur-3xl opacity-30" />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">
              Net Worth
            </p>

            <h1 className="text-3xl font-bold mt-2">
              ₹
              {netWorth.toLocaleString(
                "en-IN"
              )}
            </h1>

            <p className="text-xs mt-2 opacity-80">
              Total Bank + FD Value
            </p>
          </div>

          <TrendingUp size={22} />
        </div>
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() =>
            setShowSpend(true)
          }
          className="group bg-gradient-to-r from-red-600 to-red-500 p-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <WalletCards
            size={18}
            className="group-hover:rotate-6 transition-all"
          />
          Spend
        </button>

        <button
          onClick={() =>
            setShowTransfer(true)
          }
          className="group bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <Repeat
            size={18}
            className="group-hover:rotate-12 transition-all"
          />
          Transfer
        </button>
      </div>

      {/* 🔥 MODALS */}
      {showSpend && (
        <SpendModal
          onClose={() =>
            setShowSpend(false)
          }
        />
      )}

      {showTransfer && (
        <TransferModal
          onClose={() =>
            setShowTransfer(false)
          }
        />
      )}

      {/* 💳 CREDIT OVERVIEW */}
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 shadow-xl space-y-5">
        <div className="flex justify-between items-center">
          <p className="text-sm text-zinc-400">
            Credit Overview
          </p>

          <p className="text-sm font-semibold">
            ₹
            {creditUsed.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        {/* 🟡 MONTHLY PLAN */}
        <div className="rounded-2xl bg-zinc-950/40 p-4 space-y-2 border border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-300">
              Planned Monthly Limit
            </span>
            <span className="font-medium">
              ₹
              {plannedLimit.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                plannedUtilization >
                100
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
              style={{
                width: `${Math.min(
                  plannedUtilization,
                  100
                )}%`,
              }}
            />
          </div>

          <p
            className={`text-sm ${
              plannedUtilization >
              100
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {plannedUtilization.toFixed(
              1
            )}
            % of plan used
          </p>
        </div>

        {/* 🟢 TOTAL CREDIT */}
        <div className="rounded-2xl bg-zinc-950/40 p-4 space-y-2 border border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-300">
              Total Card Limit
            </span>
            <span className="font-medium">
              ₹
              {creditLimit.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                totalUtilization >
                30
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  totalUtilization,
                  100
                )}%`,
              }}
            />
          </div>

          <p
            className={`text-sm ${
              totalUtilization >
              30
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {totalUtilization.toFixed(
              1
            )}
            % total utilization
          </p>
        </div>
      </div>
    </div>
  );
}