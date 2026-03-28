import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
import {
  calculateCreditUsed,
  calculateAvailableLimit,
  calculateRecommendedLimit,
  calculateCreditUtilization,
} from "../../utils/creditCalculations";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function CreditCardItem({
  id,
  name,
  totalLimit,
}: {
  id: string;
  name: string;
  totalLimit: number;
}) {
  const [used, setUsed] = useState(0);
  const refreshKey = useFinanceStore((s) => s.refreshKey);

  useEffect(() => {
    const load = async () => {
      const transactions = await getTransactions();
      const usedAmount = calculateCreditUsed(transactions, id);
      setUsed(usedAmount);
    };
    load();
  }, [refreshKey, id]);

  const available = calculateAvailableLimit(totalLimit, used);
  const recommended = calculateRecommendedLimit(totalLimit);
  const utilization = calculateCreditUtilization(used, totalLimit);

  const isOverLimit = utilization > 30;

  return (
    <div className="bg-zinc-900 p-4 rounded-xl space-y-2">
      <p className="text-sm opacity-70">{name}</p>

      <div className="text-lg font-semibold">
        ₹{used.toLocaleString("en-IN")} used
      </div>

      <div className="text-sm opacity-70">
        Available: ₹{available.toLocaleString("en-IN")}
      </div>

      {/* 🔥 Utilization */}
      <div
        className={`text-sm ${
          isOverLimit ? "text-red-400" : "text-green-400"
        }`}
      >
        Utilization: {utilization.toFixed(1)}%
      </div>

      <div className="text-sm text-yellow-400">
        Safe Limit: ₹{recommended.toLocaleString("en-IN")}
      </div>

      {/* 🔥 Warning */}
      {isOverLimit && (
        <div className="text-xs text-red-500">
          ⚠️ Exceeding recommended 30% usage
        </div>
      )}
    </div>
  );
}