import { useEffect, useState } from "react";
import {
  getFDs,
  withdrawFD,
  deleteFD,
} from "../services/fdService";
import { getAccounts } from "../services/accountService";
import { useFinanceStore } from "../store/useFinanceStore";
import FDModal from "../components/accounts/FDModal";

import {
  ArrowLeft,
  Plus,
  Landmark,
  Calendar,
  Trash2,
  Banknote,
} from "lucide-react";

export default function FDs() {
  const [fds, setFds] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const refreshKey = useFinanceStore((s) => s.refreshKey);
  const refresh = useFinanceStore((s) => s.refresh);
  const setPage = useFinanceStore((s) => s.setPage);

  useEffect(() => {
    getFDs().then(setFds);
    getAccounts().then(setAccounts);
  }, [refreshKey]);

  const getBankName = (id: string) => {
    return (
      accounts.find((a) => a.id === id)?.name ||
      "Unknown Bank"
    );
  };

  return (
    <div className="p-4 pb-24 space-y-5">
      {/* 🔝 PREMIUM HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            My FDs
          </span>
        </h1>

        <button
          onClick={() => setPage("planner")}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* ➕ ADD BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/20 active:scale-95 transition"
      >
        <Plus size={18} />
        Add FD
      </button>

      {/* 📦 FD LIST */}
      {fds.map((fd) => (
        <div
          key={fd.id}
          className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 rounded-2xl border border-zinc-800 shadow-lg space-y-3"
        >
          {/* 💰 TOP ROW */}
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-white">
              ₹{fd.amount.toLocaleString()}
            </p>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                fd.status === "ACTIVE"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {fd.status}
            </span>
          </div>

          {/* 🏦 BANK */}
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Landmark size={14} className="text-indigo-400" />
            {getBankName(fd.bankAccountId)}
          </div>

          {/* 📅 DATE */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Calendar size={14} />
            Matures on{" "}
            {new Date(fd.maturityDate).toLocaleDateString()}
          </div>

          {/* ⚡ ACTIONS */}
          <div className="flex gap-2 pt-2">
            {fd.status === "ACTIVE" && (
              <button
                onClick={async () => {
                  await withdrawFD(fd.id);
                  refresh();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600/90 hover:bg-green-600 py-2 rounded-lg text-sm font-medium transition active:scale-95"
              >
                <Banknote size={16} />
                Withdraw
              </button>
            )}

            <button
              onClick={async () => {
                await deleteFD(fd.id);
                refresh();
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600/90 hover:bg-red-600 py-2 rounded-lg text-sm font-medium transition active:scale-95"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* 📭 EMPTY STATE */}
      {fds.length === 0 && (
        <div className="text-center text-zinc-500 text-sm mt-10">
          No FDs yet. Start investing 💰
        </div>
      )}

      {/* 🧾 MODAL */}
      {showModal && (
        <FDModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}