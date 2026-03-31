import { useEffect, useState } from "react";
import {
  getPlans,
  createPlan,
  addToPlan,
  withdrawFromPlan,
} from "../services/planService";
import { getAccounts } from "../services/accountService";
import { useFinanceStore } from "../store/useFinanceStore";
import {
  PieChart,
  Target,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  BarChart3,
  List,
  Clock,
  Landmark,
} from "lucide-react";

export default function FinancePlanner() {
  const [plans, setPlans] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const refresh = useFinanceStore((s) => s.refresh);
  const setPage = useFinanceStore((s) => s.setPage);

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [targetMonth, setTargetMonth] = useState("");

  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<"SAVE" | "WITHDRAW">("SAVE");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const load = async () => {
    setPlans(await getPlans());
    setAccounts(await getAccounts());
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!title || !target) return;

    const targetDate = targetMonth
      ? new Date(targetMonth).getTime()
      : undefined;

    await createPlan({
      title,
      targetAmount: Number(target),
      targetDate,
    });

    setShowCreate(false);
    setTitle("");
    setTarget("");
    setTargetMonth("");
    load();
  };

  const handleAction = async () => {
    if (!amount || !selectedBank || !selectedPlan) return;

    if (actionType === "SAVE") {
      await addToPlan({
        planId: selectedPlan.id,
        amount: Number(amount),
        bankAccountId: selectedBank,
      });
    } else {
      await withdrawFromPlan({
        planId: selectedPlan.id,
        amount: Number(amount),
        bankAccountId: selectedBank,
      });
    }

    setShowActionModal(false);
    setAmount("");
    setSelectedBank("");
    load();
    refresh();
  };

  return (
    <div className="p-4 pb-24 space-y-5">
      {/* 🔥 HEADER (FIXED ALIGNMENT) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Finance Planner
          </span>
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 rounded-xl text-sm shadow-lg active:scale-95 transition"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* 🔥 TOP NAV BUTTONS (CLEAN + PREMIUM) */}
      <div className="flex gap-2">
        <button
          onClick={() => setPage("plannerDetails")}
          className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 border border-zinc-700 py-2 rounded-xl text-sm hover:bg-zinc-800 transition"
        >
          <List size={16} />
          Details
        </button>

        <button
          onClick={() => setPage("plannerTracker")}
          className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 border border-zinc-700 py-2 rounded-xl text-sm hover:bg-zinc-800 transition"
        >
          <Clock size={16} />
          Tracker
        </button>

        <button
          onClick={() => setPage("plannerAnalytics")}
          className="flex items-center justify-center bg-zinc-900 border border-zinc-700 px-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <PieChart size={18} />
        </button>

        <button
          onClick={() => setPage("fds")}
          className="flex items-center justify-center gap-1 bg-zinc-900 border border-zinc-700 px-3 rounded-xl text-sm hover:bg-zinc-800 transition"
        >
          <Landmark size={16} />
          FDs
        </button>
      </div>

      {/* 🔥 GOALS */}
      {plans.map((p) => {
        const progress = (p.savedAmount / p.targetAmount) * 100;

        const formattedDate = p.targetDate
          ? new Date(p.targetDate).toLocaleString("en-IN", {
              month: "short",
              year: "numeric",
            })
          : null;

        return (
          <div
            key={p.id}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 rounded-2xl space-y-3 shadow-lg border border-zinc-700"
          >
            {/* TITLE */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold flex items-center gap-2">
                <Wallet size={16} /> {p.title}
              </h2>
              <p className="font-semibold text-green-400">
                ₹{p.savedAmount.toLocaleString()}
              </p>
            </div>

            <p className="text-xs text-zinc-400">
              Target: ₹{p.targetAmount.toLocaleString()}
            </p>

            {formattedDate && (
              <p className="text-xs text-purple-400">
                🎯 By: {formattedDate}
              </p>
            )}

            {/* PROGRESS */}
            <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <p className="text-xs text-green-400 font-medium">
              {progress.toFixed(1)}% achieved
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedPlan(p);
                  setActionType("SAVE");
                  setShowActionModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl text-sm shadow-md active:scale-95 transition"
              >
                <ArrowUpCircle size={16} /> Save
              </button>

              <button
                onClick={() => {
                  setSelectedPlan(p);
                  setActionType("WITHDRAW");
                  setShowActionModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-rose-600 p-2 rounded-xl text-sm shadow-md active:scale-95 transition"
              >
                <ArrowDownCircle size={16} /> Withdraw
              </button>
            </div>
          </div>
        );
      })}

      {/* ACTION MODAL */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm space-y-3 shadow-2xl">
            <h2 className="font-semibold text-lg">
              {actionType === "SAVE" ? "Save Money 💰" : "Withdraw 💸"}
            </h2>

            <input
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded-lg"
            />

            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded-lg"
            >
              <option value="">Select Bank</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAction}
              className="w-full bg-blue-600 p-2 rounded-lg"
            >
              Confirm
            </button>

            <button
              onClick={() => setShowActionModal(false)}
              className="w-full bg-zinc-700 p-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm space-y-3 shadow-2xl">
            <h2 className="font-semibold text-lg">Create Goal 🎯</h2>

            <input
              placeholder="Goal Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded-lg"
            />

            <input
              placeholder="Target Amount"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded-lg"
            />

            <input
              type="month"
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded-lg"
            />

            <button
              onClick={handleCreate}
              className="w-full bg-blue-600 p-2 rounded-lg"
            >
              Create
            </button>

            <button
              onClick={() => setShowCreate(false)}
              className="w-full bg-zinc-700 p-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}