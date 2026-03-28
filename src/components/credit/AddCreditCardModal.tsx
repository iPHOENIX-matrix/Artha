import { useState } from "react";
import { addCreditCard } from "../../services/accountService";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function AddCreditCardModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const refresh = useFinanceStore((s) => s.refresh);

  const handleAdd = async () => {
    if (!name || !limit) return;

    await addCreditCard({
      name,
      totalLimit: Number(limit),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-3">Add Credit Card</h2>

        <input
          className="w-full p-3 rounded-lg bg-zinc-800 mb-2"
          placeholder="Card Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-lg bg-zinc-800"
          placeholder="Total Limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="w-full mt-4 bg-blue-600 p-2 rounded-lg"
        >
          Add Card
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