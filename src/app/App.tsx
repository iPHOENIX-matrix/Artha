import Dashboard from "../pages/Dashboard";
import Accounts from "../pages/Accounts";
import BottomNav from "../components/layout/BottomNav";
import CreditCards from "../pages/CreditCards";
import Transactions from "../pages/Transactions";
import FDs from "../pages/FDs";
import { useFinanceStore } from "../store/useFinanceStore";

function App() {
  const page = useFinanceStore((s) => s.page);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-black text-white relative px-3 shadow-2xl">
      {page === "dashboard" && <Dashboard />}
      {page === "accounts" && <Accounts />}
      {page === "credit" && <CreditCards />}
      {page === "transactions" && <Transactions />}
      {page === "fds" && <FDs />}

      <BottomNav />
    </div>
  );
}

export default App;