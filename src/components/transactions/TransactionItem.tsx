import { useEffect, useState } from "react";
import { deleteTransaction } from "../../services/transactionService";
import {
  getCreditCardById,
  getAccounts,
} from "../../services/accountService";
import { useFinanceStore } from "../../store/useFinanceStore";
import { Trash2, AlertTriangle } from "lucide-react";

export default function TransactionItem({ t }: { t: any }) {
  const refresh = useFinanceStore((s) => s.refresh);

  const [cardName, setCardName] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (t.creditCardId) {
        const card = await getCreditCardById(t.creditCardId);
        setCardName(card?.name || "");
      }

      const accs = await getAccounts();
      setAccounts(accs);
    };

    load();
  }, [t]);

  const getBankName = (id: string) =>
    accounts.find((a) => a.id === id)?.name || "Bank";

  const handleDelete = async () => {
    await deleteTransaction(t.id);
    setShowDelete(false);
    refresh();
  };

  const colorMap: Record<string, string> = {
    INCOME: "border-green-500",
    EXPENSE: "border-red-500",
    TRANSFER: "border-blue-500",
    CREDIT_SPEND: "border-orange-500",
    CREDIT_REPAY: "border-emerald-500",
    FD_BOOKED: "border-purple-500",
  };

  /* =========================
     🧠 SMART LABEL LOGIC
  ========================= */

  let transactionLabel = "";

  if (t.type === "EXPENSE") {
    transactionLabel = `${getBankName(t.bankAccountId)} Spend`;
  } else if (t.type === "TRANSFER") {
    transactionLabel = `${getBankName(
      t.bankAccountId
    )} → ${getBankName(t.toBankAccountId)}`;
  } else if (t.creditCardId) {
    transactionLabel = `${cardName || "Card"} Spend`;
  } else if (t.type === "FD_BOOKED") {
    transactionLabel = "FD Booked";
  } else if (t.type === "INCOME") {
    transactionLabel = `${getBankName(t.bankAccountId)} Deposit`;
  } else {
    transactionLabel = t.type;
  }

  return (
    <>
      {/* TRANSACTION CARD */}
      <div
        className={`bg-zinc-900 border-l-4 ${
          colorMap[t.type]
        } p-4 rounded-xl flex justify-between items-center shadow-sm`}
      >
        <div>
          <p className="text-sm font-medium">
            {transactionLabel}
            {t.category ? ` • ${t.category}` : ""}
          </p>

          <p className="text-xs text-zinc-400 mt-1">
            {new Date(t.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-white">
            ₹{t.amount.toLocaleString()}
          </p>

          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-1 text-xs text-red-400 mt-2 hover:text-red-300 transition"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>

      {/* 🧨 PREMIUM DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-[90%] max-w-sm space-y-4 shadow-2xl">
            
            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 p-2 rounded-full">
                <AlertTriangle className="text-red-400" size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Delete Transaction
                </h2>
                <p className="text-xs text-zinc-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 transition p-2 rounded-lg text-sm font-medium"
              >
                Delete
              </button>

              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition p-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}