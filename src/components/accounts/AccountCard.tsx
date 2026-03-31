import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
import { calculateBalance } from "../../utils/calculations";
import AddMoneyModal from "./AddMoneyModal";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function AccountCard({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [balance, setBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const refreshKey = useFinanceStore((s) => s.refreshKey);

  useEffect(() => {
    const load = async () => {
      const transactions = await getTransactions();
      const bal = calculateBalance(transactions, id);
      setBalance(bal);
    };
    load();
  }, [refreshKey, id]);

  return (
    <>
      <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 rounded-2xl border border-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
        
        {/* 🔥 Top Section */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-zinc-400 tracking-wide">{name}</p>
            <h2 className="text-2xl font-bold mt-2 text-white">
              ₹{balance.toLocaleString("en-IN")}
            </h2>
          </div>

          {/* 💎 Actions */}
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white/10 hover:bg-white/20 text-green-400 px-3 py-1 rounded-lg text-xs transition-all"
            >
              + Add
            </button>
          </div>
        </div>

        {/* ✨ Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl opacity-0 hover:opacity-100 transition pointer-events-none" />
      </div>

      {showModal && (
        <AddMoneyModal
          accountId={id}
          onClose={() => setShowModal(false)}
          defaultType="INCOME"
        />
      )}
    </>
  );
}