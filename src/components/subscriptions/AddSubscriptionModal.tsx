import { useEffect, useState } from "react";
import { addSubscription } from "../../services/subscriptionService";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  getAccounts,
  getCreditCards,
} from "../../services/accountService";
import { X, AlertTriangle } from "lucide-react";

export default function AddSubscriptionModal({ onClose }: any) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState("MONTHLY");

  const [renewalDate, setRenewalDate] = useState("");
  const [autoDebit, setAutoDebit] = useState(true);

  const [paymentSource, setPaymentSource] = useState<
    "" | "BANK" | "CREDIT"
  >("");

  const [accounts, setAccounts] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

  // ✅ NEW: cancel confirmation state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const refresh = useFinanceStore((s) => s.refresh);

  // 🆕 MODAL STATE
  const setModalOpen = useFinanceStore((s) => s.setModalOpen);

  useEffect(() => {

    setModalOpen(true); // 🔥 OPEN

    const load = async () => {
      const accs = await getAccounts();
      const cds = await getCreditCards();
      setAccounts(accs);
      setCards(cds);
    };
    load();

    return () => setModalOpen(false); // 🔥 CLOSE

  }, []);

  const handleSave = async () => {
    if (!name || !amount || !renewalDate) {
      alert("Please fill all required fields");
      return;
    }

    await addSubscription({
      name,
      amount: Number(amount),
      billingCycle: cycle,
      renewalDate: new Date(renewalDate).getTime(),
      autoDebit,
      paymentSource: autoDebit ? paymentSource : undefined,
      bankAccountId:
        paymentSource === "BANK"
          ? selectedAccount
          : undefined,
      creditCardId:
        paymentSource === "CREDIT"
          ? selectedCard
          : undefined,
    });

    refresh();
    onClose();
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-[90%] max-w-sm max-h-[90vh] flex flex-col rounded-2xl overflow-hidden border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl">

          {/* HEADER */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-700">
            <h2 className="font-semibold text-lg tracking-wide">
              Add Subscription
            </h2>

            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-zinc-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-5 space-y-4 overflow-y-auto">

            <input
              placeholder="Subscription Name"
              className="w-full p-3 bg-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              placeholder="Amount"
              type="number"
              className="w-full p-3 bg-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <select
              className="w-full p-3 bg-zinc-800 rounded-xl"
              value={cycle}
              onChange={(e) =>
                setCycle(e.target.value)
              }
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>

            <input
              type="date"
              className="w-full p-3 bg-zinc-800 rounded-xl"
              value={renewalDate}
              onChange={(e) =>
                setRenewalDate(e.target.value)
              }
            />

            {/* Auto Debit */}
            <div className="flex justify-between items-center bg-zinc-800 p-3 rounded-xl">
              <span className="text-sm text-zinc-300">
                Auto Debit
              </span>

              <button
                onClick={() =>
                  setAutoDebit(!autoDebit)
                }
                className={`w-11 h-6 rounded-full transition ${
                  autoDebit
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                    : "bg-zinc-600"
                }`}
              >
                <div
                  className={`h-6 w-6 bg-white rounded-full transition ${
                    autoDebit
                      ? "translate-x-5"
                      : ""
                  }`}
                />
              </button>
            </div>

            {/* Payment Source */}
            {autoDebit && (
              <>
                <select
                  className="w-full p-3 bg-zinc-800 rounded-xl"
                  value={paymentSource}
                  onChange={(e) =>
                    setPaymentSource(
                      e.target.value as any
                    )
                  }
                >
                  <option value="">
                    Select Payment Source
                  </option>
                  <option value="BANK">
                    Bank Account
                  </option>
                  <option value="CREDIT">
                    Credit Card
                  </option>
                </select>

                {paymentSource === "BANK" && (
                  <select
                    className="w-full p-3 bg-zinc-800 rounded-xl"
                    value={selectedAccount}
                    onChange={(e) =>
                      setSelectedAccount(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Bank
                    </option>
                    {accounts.map((acc) => (
                      <option
                        key={acc.id}
                        value={acc.id}
                      >
                        {acc.name}
                      </option>
                    ))}
                  </select>
                )}

                {paymentSource === "CREDIT" && (
                  <select
                    className="w-full p-3 bg-zinc-800 rounded-xl"
                    value={selectedCard}
                    onChange={(e) =>
                      setSelectedCard(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Card
                    </option>
                    {cards.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>

          {/* 🔥 GRID BUTTONS */}
          <div className="p-4 border-t border-zinc-700 bg-zinc-900 grid grid-cols-2 gap-3">

            <button
              onClick={() => setShowCancelConfirm(true)}
              className="bg-zinc-700 p-3 rounded-xl hover:bg-zinc-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl font-medium shadow-lg hover:scale-[1.02] transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 CONFIRMATION POPUP */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-zinc-900 rounded-2xl p-5 w-[85%] max-w-xs text-center space-y-4 shadow-2xl border border-zinc-700">

            <AlertTriangle className="mx-auto text-yellow-400" size={28} />

            <h3 className="font-semibold text-lg">
              Discard changes?
            </h3>

            <p className="text-sm text-zinc-400">
              Your entered data will be lost.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="bg-zinc-700 p-2 rounded-lg"
              >
                Stay
              </button>

              <button
                onClick={onClose}
                className="bg-red-600 p-2 rounded-lg"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}