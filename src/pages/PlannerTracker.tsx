import { useEffect, useState } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import {
  getPlans,
  getPlanTransactions,
  deletePlanTransaction,
} from "../services/planService";
import { getAccounts } from "../services/accountService";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function PlannerTracker() {
  const setPage = useFinanceStore((s) => s.setPage);

  const [txns, setTxns] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const plansData = await getPlans();
    setPlans(plansData);

    let allTxns: any[] = [];

    for (const p of plansData) {
      const t = await getPlanTransactions(p.id);
      allTxns = [...allTxns, ...t];
    }

    setTxns(allTxns.sort((a, b) => b.createdAt - a.createdAt));
    setAccounts(await getAccounts());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    await deletePlanTransaction(deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Tracker
          </span>
        </h1>

        <button
          onClick={() => setPage("planner")}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* 🔥 TRANSACTIONS */}
      {txns.map((t) => {
        const bank = accounts.find((a) => a.id === t.bankAccountId);
        const plan = plans.find((p) => p.id === t.planId);

        const isSave = t.type === "SAVE";

        return (
          <div
            key={t.id}
            className={`p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
              isSave
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            {/* TOP ROW */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-base">
                  {plan?.title || "Goal"}
                </p>

                <p className="text-xs text-zinc-400">
                  {isSave
                    ? `Saved to ${bank?.name}`
                    : `Withdrawn from ${bank?.name}`}
                </p>
              </div>

              <p
                className={`text-lg font-semibold ${
                  isSave ? "text-green-400" : "text-red-400"
                }`}
              >
                {isSave ? "+" : "-"}₹{t.amount.toLocaleString()}
              </p>
            </div>

            {/* DATE */}
            <p className="text-xs text-zinc-500 mt-2">
              {new Date(t.createdAt).toLocaleString()}
            </p>

            {/* DELETE BUTTON */}
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setDeleteId(t.id)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        );
      })}

      {/* 🔥 DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-2xl w-[90%] max-w-sm space-y-4 border border-zinc-700">
            <h2 className="text-lg font-semibold">
              Delete Transaction?
            </h2>

            <p className="text-sm text-zinc-400">
              This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 p-2 rounded-lg hover:bg-red-500 transition"
              >
                Delete
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-zinc-700 p-2 rounded-lg hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}