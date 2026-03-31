import Dashboard from "../pages/Dashboard";
import Accounts from "../pages/Accounts";
import BottomNav from "../components/layout/BottomNav";
import CreditCards from "../pages/CreditCards";
import Transactions from "../pages/Transactions";
import FDs from "../pages/FDs";
import FinancePlanner from "../pages/FinancePlanner";
import PlannerDetails from "../pages/PlannerDetails";
import PlannerTracker from "../pages/PlannerTracker";
import PlannerAnalytics from "../pages/PlannerAnalytics";

import { useFinanceStore } from "../store/useFinanceStore";
import Subscriptions from "../pages/Subscriptions";

function App() {
  const page = useFinanceStore((s) => s.page);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-black text-white relative px-3 shadow-2xl">
      {page === "dashboard" && <Dashboard />}
      {page === "accounts" && <Accounts />}
      {page === "credit" && <CreditCards />}
      {page === "transactions" && <Transactions />}
      {page === "fds" && <FDs />}
      {page === "planner" && <FinancePlanner />}
      {page === "plannerDetails" && <PlannerDetails />}
      {page === "plannerTracker" && <PlannerTracker />}
      {page === "plannerAnalytics" && <PlannerAnalytics />}
      {page === "subs" && <Subscriptions />}

      <BottomNav />
    </div>
  );
}

export default App;