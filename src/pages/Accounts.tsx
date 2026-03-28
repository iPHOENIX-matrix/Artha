import { useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import AccountCard from "../components/accounts/AccountCard";
import AddAccountModal from "../components/accounts/AddAccountModal";
import { useFinanceStore } from "../store/useFinanceStore";

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const refreshKey = useFinanceStore((s) => s.refreshKey);

  useEffect(() => {
    const load = async () => {
      const data = await getAccounts();
      setAccounts(data);
    };
    load();
  }, [refreshKey]);

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Bank Accounts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-3 py-1 rounded-lg"
        >
          + Add
        </button>
      </div>

      {accounts.map((acc) => (
        <AccountCard key={acc.id} id={acc.id} name={acc.name} />
        ))}

      {accounts.length === 0 && (
        <p className="text-center opacity-50 mt-10">
            No accounts yet. Add one 👆
        </p>
        )}

      {showModal && <AddAccountModal onClose={() => setShowModal(false)} />}
    </div>
  );
}