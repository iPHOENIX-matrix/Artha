import { useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import { getTransactions } from "../services/transactionService";
import { calculateBalance } from "../utils/calculations";

import AccountCard from "../components/accounts/AccountCard";
import AddAccountModal from "../components/accounts/AddAccountModal";
import { useFinanceStore } from "../store/useFinanceStore";

import { Landmark, Plus } from "lucide-react";

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const refreshKey = useFinanceStore((s) => s.refreshKey);

  useEffect(() => {
    const load = async () => {
      const accs = await getAccounts();
      const txns = await getTransactions();

      setAccounts(accs);

      // 💰 Calculate total using SAME logic as AccountCard
      let total = 0;

      accs.forEach((acc) => {
        const bal = calculateBalance(txns, acc.id);
        total += bal;
      });

      setTotalBalance(total);
    };

    load();
  }, [refreshKey]);

  return (
    <div className="p-4 pb-24 space-y-5">
      {/* 🔝 PREMIUM HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Landmark size={20} className="text-indigo-400" />
          <h1 className="text-xl font-semibold tracking-tight">
            Bank Accounts
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20 active:scale-95 transition"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* 💰 TOTAL BALANCE CARD */}
      {accounts.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-500 p-5 rounded-2xl shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          
          {/* Glow */}
          <div className="absolute inset-0 bg-white/10 blur-2xl opacity-20" />

          <p className="text-sm text-white/80 relative z-10">
            Total Balance
          </p>

          <p className="text-3xl font-bold text-white mt-1 relative z-10">
            ₹{totalBalance.toLocaleString("en-IN")}
          </p>

          <p className="text-xs text-white/60 mt-1 relative z-10">
            Across all bank accounts
          </p>
        </div>
      )}

      {/* 🏦 ACCOUNTS */}
      {accounts.map((acc) => (
        <AccountCard
          key={acc.id}
          id={acc.id}
          name={acc.name}
        />
      ))}

      {/* 📭 EMPTY STATE */}
      {accounts.length === 0 && (
        <p className="text-center text-zinc-500 mt-10">
          No accounts yet. Add one 👆
        </p>
      )}

      {/* ➕ MODAL */}
      {showModal && (
        <AddAccountModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}