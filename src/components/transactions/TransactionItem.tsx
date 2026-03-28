import { useEffect, useState } from "react";
import { deleteTransaction } from "../../services/transactionService";
import {
  getCreditCardById,
} from "../../services/accountService";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function TransactionItem({
  t,
}: {
  t: any;
}) {
  const refresh = useFinanceStore((s) => s.refresh);

  const [cardName, setCardName] =
    useState("");

  useEffect(() => {
    const loadCard = async () => {
      if (t.creditCardId) {
        const card =
          await getCreditCardById(
            t.creditCardId
          );

        setCardName(card?.name || "");
      }
    };

    loadCard();
  }, [t]);

  const handleDelete = async () => {
    await deleteTransaction(t.id);
    refresh();
  };

  const colorMap: Record<
    string,
    string
  > = {
    INCOME: "border-green-500",
    EXPENSE: "border-red-500",
    TRANSFER: "border-blue-500",
    CREDIT_SPEND: "border-orange-500",
    CREDIT_REPAY:
      "border-emerald-500",
    FD_BOOKED: "border-purple-500",
  };

  const labelMap: Record<
    string,
    string
  > = {
    INCOME: "Money Added",
    EXPENSE: "Bank Spend",
    TRANSFER:
      "Bank Transfer",
    CREDIT_SPEND:
      "Credit Card Spend",
    CREDIT_REPAY:
      "Credit Card Repayment",
    FD_BOOKED: "FD Booked",
  };

  const transactionLabel =
    t.creditCardId
      ? `${
          cardName || "Card"
        } Spend`
      : labelMap[t.type] ||
        t.type;

  return (
    <div
      className={`bg-zinc-900 border-l-4 ${
        colorMap[t.type]
      } p-3 rounded-lg flex justify-between`}
    >
      <div>
        <p className="text-sm font-medium">
          {transactionLabel}
          {t.category
            ? ` • ${t.category}`
            : ""}
        </p>

        <p className="text-xs opacity-60">
          {new Date(
            t.createdAt
          ).toLocaleString()}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold">
          ₹{t.amount}
        </p>

        <button
          onClick={handleDelete}
          className="text-xs text-red-400 mt-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}