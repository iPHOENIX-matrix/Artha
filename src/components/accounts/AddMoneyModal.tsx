import { useState } from "react";
import { addTransaction } from "../../services/transactionService";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function AddMoneyModal({
  accountId,
  onClose,
  defaultType,
}: {
  accountId: string;
  onClose: () => void;
  defaultType: "INCOME";
}) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const refresh = useFinanceStore((s) => s.refresh);

  const handleSubmit = async () => {
    if (!amount) return;

    await addTransaction({
      type: "INCOME",
      amount: Number(amount),
      category: source || "General",
      bankAccountId: accountId,
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl w-[90%] max-w-sm border border-zinc-800 shadow-2xl space-y-4">
        
        {/* 🔝 Title */}
        <h2 className="text-lg font-semibold text-white">
          Add Money 💰
        </h2>

        {/* 💰 Amount */}
        <input
          className="w-full p-3 rounded-lg bg-zinc-800 outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* 🧾 Source */}
        <input
          className="w-full p-3 rounded-lg bg-zinc-800 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Source (Salary, Gift, Freelance...)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        {/* ✅ CTA */}
        <button
          onClick={handleSubmit}
          className="w-full mt-2 p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 font-medium shadow-lg shadow-green-500/20 active:scale-95 transition"
        >
          Add Money
        </button>

        {/* ❌ Cancel */}
        <button
          onClick={onClose}
          className="w-full bg-zinc-700 p-2 rounded-lg text-sm hover:bg-zinc-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}