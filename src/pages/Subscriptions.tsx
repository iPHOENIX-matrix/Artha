import { useEffect, useState } from "react";
import {
  getSubscriptions,
  deleteSubscription,
} from "../services/subscriptionService";
import { useFinanceStore } from "../store/useFinanceStore";
import AddSubscriptionModal from "../components/subscriptions/AddSubscriptionModal";
import { Bell, Plus, Zap, Trash2 } from "lucide-react";

export default function Subscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedSub, setSelectedSub] = useState<any>(null);

  const refreshKey = useFinanceStore((s) => s.refreshKey);
  const refresh = useFinanceStore((s) => s.refresh);

  useEffect(() => {
    getSubscriptions().then(setSubs);
  }, [refreshKey]);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!selectedSub) return;

    await deleteSubscription(selectedSub.id);
    setSelectedSub(null);
    refresh();
  };

  return (
    <div className="p-4 pb-24 space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="text-purple-400" />
          <h1 className="text-xl font-semibold tracking-wide">
            My Subscriptions
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:scale-105 transition"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {subs.map((s) => (
          <div
            key={s.id}
            className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/30 to-pink-500/20"
          >
            <div className="bg-zinc-900 rounded-2xl p-4 space-y-2 shadow-xl">

              {/* NAME + ACTIONS (TOP RIGHT) */}
              <div className="flex justify-between items-start">
                <p className="font-semibold text-base">
                  {s.name}
                </p>

                <div className="flex items-center gap-2">
                  {s.autoDebit && (
                    <Zap
                      size={16}
                      className="text-yellow-400"
                    />
                  )}

                  <button
                    onClick={() => setSelectedSub(s)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* AMOUNT */}
              <p className="text-lg font-semibold text-white">
                ₹{s.amount}
              </p>

              {/* BILLING */}
              <p className="text-xs text-zinc-400 tracking-wide">
                {s.billingCycle}
              </p>

              {/* NEXT RENEWAL */}
              <p className="text-xs text-indigo-400">
                Next renewal: {formatDate(s.renewalDate)}
              </p>

            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {subs.length === 0 && (
        <div className="text-center mt-16 text-zinc-500 space-y-2">
          <Bell size={32} className="mx-auto opacity-40" />
          <p>No subscriptions yet</p>
          <p className="text-xs">
            Start tracking your expenses 💸
          </p>
        </div>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <AddSubscriptionModal
          onClose={() => setShowModal(false)}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-zinc-900 rounded-2xl p-5 w-[85%] max-w-xs text-center space-y-4 shadow-2xl border border-zinc-700">

            <Trash2 className="mx-auto text-red-500" size={28} />

            <h3 className="font-semibold text-lg">
              Delete Subscription?
            </h3>

            <p className="text-sm text-zinc-400">
              {selectedSub.name} will be removed permanently.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setSelectedSub(null)}
                className="bg-zinc-700 p-2 rounded-lg hover:bg-zinc-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 p-2 rounded-lg hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}