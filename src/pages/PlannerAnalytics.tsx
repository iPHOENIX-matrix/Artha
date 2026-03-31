import { useEffect, useState } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import { getAccounts } from "../services/accountService";
import { getTransactions } from "../services/transactionService";
import {
  getPlans,
  getPlanTransactions,
} from "../services/planService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { ArrowLeft, Landmark } from "lucide-react";

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#14b8a6",
];

export default function PlannerAnalytics() {
  const setPage = useFinanceStore((s) => s.setPage);

  const [bankData, setBankData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const accounts = await getAccounts();
      const txns = await getTransactions();
      const plans = await getPlans();

      const bankBalance: Record<string, number> = {};

      txns.forEach((t: any) => {
        if (!t.bankAccountId) return;

        if (!bankBalance[t.bankAccountId])
          bankBalance[t.bankAccountId] = 0;

        if (t.type === "INCOME")
          bankBalance[t.bankAccountId] += t.amount;

        if (t.type === "EXPENSE")
          bankBalance[t.bankAccountId] -= t.amount;

        if (t.type === "TRANSFER") {
          bankBalance[t.bankAccountId] -= t.amount;

          if (t.toBankAccountId) {
            bankBalance[t.toBankAccountId] =
              (bankBalance[t.toBankAccountId] || 0) +
              t.amount;
          }
        }

        if (t.type === "FD_BOOKED") {
          bankBalance[t.bankAccountId] -= t.amount;
        }
      });

      const planMap: Record<string, Record<string, number>> = {};

      for (const p of plans) {
        const txns = await getPlanTransactions(p.id);

        txns.forEach((t) => {
          if (!planMap[t.bankAccountId])
            planMap[t.bankAccountId] = {};

          if (!planMap[t.bankAccountId][p.title])
            planMap[t.bankAccountId][p.title] = 0;

          if (t.type === "SAVE")
            planMap[t.bankAccountId][p.title] += t.amount;
          else planMap[t.bankAccountId][p.title] -= t.amount;
        });
      }

      const result = accounts.map((acc) => {
        const totalBank = bankBalance[acc.id] || 0;

        const goals = planMap[acc.id] || {};

        const totalAllocated = Object.values(goals).reduce(
          (a, b) => a + b,
          0
        );

        const freeCash = totalBank - totalAllocated;

        const pieData = [
          ...Object.entries(goals).map(([key, val]) => ({
            name: key,
            value: val,
          })),
          {
            name: "Free Cash",
            value: freeCash,
          },
        ].filter((d) => d.value > 0);

        return {
          bankName: acc.name,
          total: totalBank,
          pieData,
        };
      });

      setBankData(result);
    };

    load();
  }, []);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* 🔥 PREMIUM HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Analytics
          </span>
        </h1>

        <button
          onClick={() => setPage("planner")}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* 🔥 BANK CARDS */}
      {bankData.map((bank, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 shadow-lg space-y-4"
        >
          {/* 🏦 HEADER */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Landmark size={18} className="text-zinc-400" />
              <h2 className="font-semibold text-lg">
                {bank.bankName}
              </h2>
            </div>

            <p className="text-sm text-zinc-400">
              ₹{bank.total.toLocaleString()}
            </p>
          </div>

          {/* 🥧 PIE CHART */}
          <div className="w-full h-52 flex items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={bank.pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={55}
                  paddingAngle={3}
                  isAnimationActive={true}
                >
                  {bank.pieData.map((entry: any, index: number) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: any) =>
                    `₹${Number(value).toLocaleString()}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 📊 LEGEND */}
          <div className="space-y-2">
            {bank.pieData.map((item: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[i % COLORS.length],
                    }}
                  />
                  <span className="text-zinc-300">
                    {item.name}
                  </span>
                </div>

                <span className="text-zinc-400">
                  ₹{Number(item.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}