import { useEffect, useState } from "react";
import { getAccounts } from "../../services/accountService";
import { transferMoney } from "../../services/transactionService";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function TransferModal({ onClose }: { onClose: () => void }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const refresh = useFinanceStore((s) => s.refresh);

  useEffect(() => {
    getAccounts().then(setAccounts);
  }, []);

  const handleTransfer = async () => {
    if (!from || !to || !amount || from === to) return;

    await transferMoney(from, to, Number(amount));
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-3">Transfer Money</h2>

        <select
          className="w-full p-2 mb-2 bg-zinc-800 rounded"
          onChange={(e) => setFrom(e.target.value)}
        >
          <option value="">From Account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 mb-2 bg-zinc-800 rounded"
          onChange={(e) => setTo(e.target.value)}
        >
          <option value="">To Account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <input
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleTransfer}
          className="w-full mt-3 bg-blue-600 p-2 rounded"
        >
          Transfer
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 bg-zinc-700 p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}