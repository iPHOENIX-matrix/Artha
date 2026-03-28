import { useEffect, useState } from "react";
import {
  getFDs,
  withdrawFD,
  deleteFD,
} from "../services/fdService";
import { getAccounts } from "../services/accountService";
import { useFinanceStore } from "../store/useFinanceStore";
import FDModal from "../components/accounts/FDModal";

export default function FDs() {
  const [fds, setFds] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const refreshKey = useFinanceStore((s) => s.refreshKey);
  const refresh = useFinanceStore((s) => s.refresh);

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
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">FDs</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          + Add FD
        </button>
      </div>

      {fds.map((fd) => (
        <div
          key={fd.id}
          className="bg-zinc-900 p-4 rounded-xl space-y-2"
        >
          <div className="flex justify-between">
            <p className="text-lg font-semibold">
              ₹{fd.amount}
            </p>

            <span
              className={`text-xs px-2 py-1 rounded ${
                fd.status === "ACTIVE"
                  ? "bg-green-700"
                  : "bg-red-700"
              }`}
            >
              {fd.status}
            </span>
          </div>

          <p className="text-sm text-zinc-400">
            Bank: {getBankName(fd.bankAccountId)}
          </p>

          <p className="text-xs text-zinc-400">
            Matures:{" "}
            {new Date(
              fd.maturityDate
            ).toLocaleDateString()}
          </p>

          <div className="flex gap-2">
            {fd.status === "ACTIVE" && (
              <button
                onClick={async () => {
                  await withdrawFD(fd.id);
                  refresh();
                }}
                className="bg-green-600 px-3 py-1 rounded text-sm"
              >
                Withdraw
              </button>
            )}

            <button
              onClick={async () => {
                await deleteFD(fd.id);
                refresh();
              }}
              className="bg-red-600 px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <FDModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}