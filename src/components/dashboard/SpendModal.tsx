import { useEffect, useState } from "react";
import { addTransaction } from "../../services/transactionService";
import {
  getAccounts,
  getCreditCards,
} from "../../services/accountService";
import { useFinanceStore } from "../../store/useFinanceStore";

type Mode = "BANK" | "CREDIT_SPEND" | "CREDIT_REPAY";

export default function SpendModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("BANK");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const refresh = useFinanceStore((s) => s.refresh);

  useEffect(() => {
    getAccounts().then(setAccounts);
    getCreditCards().then(setCards);
  }, []);

  const handleSubmit = async () => {
    if (!selectedId || !amount) return;

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) return;

    if (mode === "BANK") {
      await addTransaction({
        type: "EXPENSE",
        amount: numericAmount,
        category,
        bankAccountId: selectedId,
      });
    }

    if (mode === "CREDIT_SPEND") {
      await addTransaction({
        type: "CREDIT_SPEND",
        amount: numericAmount,
        category,
        creditCardId: selectedId,
      });
    }

    if (mode === "CREDIT_REPAY") {
      await addTransaction({
        type: "CREDIT_REPAY",
        amount: numericAmount,
        category: category || "Repayment",
        creditCardId: selectedId,
      });
    }

    refresh();
    onClose();
  };

  const list = mode === "BANK" ? accounts : cards;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm space-y-3 shadow-xl border border-zinc-800">
        <h2 className="text-lg font-semibold">
          {mode === "CREDIT_REPAY"
            ? "Repay Credit Card"
            : "Spend Money"}
        </h2>

        {/* MODE */}
        <select
          className="w-full p-3 bg-zinc-800 rounded-lg outline-none"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as Mode);
            setSelectedId("");
            setCategory("");
          }}
        >
          <option value="BANK">Bank Spend</option>
          <option value="CREDIT_SPEND">Credit Spend</option>
          <option value="CREDIT_REPAY">Credit Repay</option>
        </select>

        {/* ACCOUNT / CARD */}
        <select
          className="w-full p-3 bg-zinc-800 rounded-lg outline-none"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">
            {mode === "BANK"
              ? "Select Bank Account"
              : "Select Credit Card"}
          </option>

          {list.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        {/* CATEGORY */}
        <input
          className="w-full p-3 bg-zinc-800 rounded-lg outline-none"
          placeholder={
            mode === "CREDIT_REPAY"
              ? "Repayment note (optional)"
              : "Category (Food, Petrol, Shopping)"
          }
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* AMOUNT */}
        <input
          className="w-full p-3 bg-zinc-800 rounded-lg outline-none"
          placeholder="Enter amount"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* BUTTONS */}
        <button
          onClick={handleSubmit}
          className={`w-full p-3 rounded-lg font-medium transition ${
            mode === "CREDIT_REPAY"
              ? "bg-green-600 hover:bg-green-500"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {mode === "CREDIT_REPAY" ? "Repay Now" : "Confirm"}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-zinc-700 hover:bg-zinc-600 p-3 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}