import { useState } from "react";
import { addAccount } from "../../services/accountService";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function AddAccountModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const refresh = useFinanceStore((s) => s.refresh);

  const handleAdd = async () => {
    if (!name) return;

    await addAccount(name);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-5 rounded-2xl w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-3">Add Bank Account</h2>

        <input
          className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
          placeholder="Enter bank name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAdd}
            className="flex-1 bg-blue-600 p-2 rounded-lg"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-700 p-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}