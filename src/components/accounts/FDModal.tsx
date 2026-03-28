import { useEffect, useState } from "react";
import { getAccounts } from "../../services/accountService";
import { createFD } from "../../services/fdService";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function FDModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [deductFromBank, setDeductFromBank] = useState(true);

  const refresh = useFinanceStore((s) => s.refresh);

  useEffect(() => {
    getAccounts().then(setAccounts);
  }, []);

  const handleCreate = async () => {
    if (!accountId || !amount || !maturityDate) return;

    await createFD({
      bankAccountId: accountId,
      amount: Number(amount),
      maturityDate: new Date(maturityDate).getTime(),
      deductFromBank,
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm space-y-3">
        <h2 className="text-lg font-semibold">Create FD</h2>

        <select
          className="w-full p-3 bg-zinc-800 rounded-lg"
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <input
          className="w-full p-3 bg-zinc-800 rounded-lg"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          className="w-full p-3 bg-zinc-800 rounded-lg"
          type="date"
          value={maturityDate}
          onChange={(e) => setMaturityDate(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={deductFromBank}
            onChange={(e) =>
              setDeductFromBank(e.target.checked)
            }
          />
          Deduct from selected bank
        </label>

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 p-3 rounded-lg"
        >
          Create FD
        </button>

        <button
          onClick={onClose}
          className="w-full bg-zinc-700 p-3 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}