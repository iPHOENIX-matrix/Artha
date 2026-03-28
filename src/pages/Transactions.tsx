import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService";
import TransactionItem from "../components/transactions/TransactionItem";
import { useFinanceStore } from "../store/useFinanceStore";

export default function Transactions() {
  const [data, setData] = useState<any[]>([]);
  const refreshKey = useFinanceStore(
    (s) => s.refreshKey
  );

  useEffect(() => {
    const loadTransactions =
      async () => {
        const res =
          await getTransactions();

        // ✅ Sort latest by date/time first
        const sorted =
          [...res].sort(
            (a, b) =>
              b.createdAt -
              a.createdAt
          );

        setData(sorted);
      };

    loadTransactions();
  }, [refreshKey]);

  return (
    <div className="p-4 pb-20 space-y-3">
      <h1 className="text-xl font-semibold">
        Transactions
      </h1>

      {data.map((t) => (
        <TransactionItem
          key={t.id}
          t={t}
        />
      ))}
    </div>
  );
}