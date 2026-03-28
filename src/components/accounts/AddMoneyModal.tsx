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
  defaultType: "INCOME" | "EXPENSE";
}) {
  const [amount, setAmount] = useState("");
  const refresh = useFinanceStore((s) => s.refresh);

  const handleSubmit = async () => {
    if (!amount) return;

    await addTransaction({
      type: defaultType,
      amount: Number(amount),
      bankAccountId: accountId,
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-3">
          {defaultType === "INCOME" ? "Add Money" : "Spend Money"}
        </h2>

        <input
          className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className={`w-full mt-4 p-2 rounded-lg ${
            defaultType === "INCOME" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {defaultType === "INCOME" ? "Add Money" : "Spend"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 bg-zinc-700 p-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}