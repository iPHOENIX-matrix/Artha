import { useEffect, useState } from "react";
import {
  getCreditCards,
  getMonthlyCreditSpendLimit,
  setMonthlyCreditSpendLimit,
} from "../services/accountService";
import CreditCardItem from "../components/credit/CreditCardItem";
import AddCreditCardModal from "../components/credit/AddCreditCardModal";
import { useFinanceStore } from "../store/useFinanceStore";

export default function CreditCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [monthlyLimit, setMonthlyLimit] =
    useState(0);

  const [showLimitModal, setShowLimitModal] =
    useState(false);

  const [limitInput, setLimitInput] =
    useState("");

  const refreshKey = useFinanceStore(
    (s) => s.refreshKey
  );

  const refresh = useFinanceStore(
    (s) => s.refresh
  );

  useEffect(() => {
    const load = async () => {
      const data =
        await getCreditCards();

      const limit =
        await getMonthlyCreditSpendLimit();

      setCards(data);
      setMonthlyLimit(limit);
    };

    load();
  }, [refreshKey]);

  const handleSaveLimit = async () => {
    const amount = Number(limitInput);

    if (!amount || amount <= 0) return;

    await setMonthlyCreditSpendLimit(
      amount
    );

    setShowLimitModal(false);
    setLimitInput("");

    refresh();
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Credit Cards
        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-blue-600 px-3 py-1 rounded-lg"
        >
          + Add
        </button>
      </div>

      {/* 🔥 MONTHLY LIMIT CARD */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <p className="text-sm text-zinc-400">
          Monthly Credit Spend Limit
        </p>

        <h2 className="text-xl font-semibold mt-1">
          ₹
          {monthlyLimit.toLocaleString(
            "en-IN"
          )}
        </h2>

        <button
          onClick={() =>
            setShowLimitModal(true)
          }
          className="mt-3 bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded-lg text-sm transition"
        >
          Set Monthly Limit
        </button>
      </div>

      <p className="text-xs text-zinc-400">
        Use dashboard Spend button for
        spend / repay
      </p>

      {cards.map((card) => (
        <CreditCardItem
          key={card.id}
          id={card.id}
          name={card.name}
          totalLimit={card.totalLimit}
        />
      ))}

      {/* 🔥 ADD CARD MODAL */}
      {showModal && (
        <AddCreditCardModal
          onClose={() =>
            setShowModal(false)
          }
        />
      )}

      {/* 🔥 BEAUTIFUL LIMIT MODAL */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <h2 className="text-lg font-semibold">
              Set Monthly Limit
            </h2>

            <p className="text-sm text-zinc-400">
              Set your planned credit
              spend for one billing
              cycle
            </p>

            <input
              type="number"
              placeholder="Enter amount"
              value={limitInput}
              onChange={(e) =>
                setLimitInput(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-purple-500"
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={
                  handleSaveLimit
                }
                className="bg-purple-600 hover:bg-purple-500 transition p-3 rounded-xl font-medium"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShowLimitModal(
                    false
                  )
                }
                className="bg-zinc-700 hover:bg-zinc-600 transition p-3 rounded-xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}