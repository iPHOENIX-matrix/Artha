import {
  getSubscriptions,
  updateSubscription,
} from "../services/subscriptionService";
import {
  addTransaction,
  getTransactions,
} from "../services/transactionService";

// ✅ LOCK (prevents parallel execution)
let isEngineRunning = false;

// ✅ Helper: Add months safely (calendar correct)
const addMonths = (date: number, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
};

// ✅ Helper: Add years safely
const addYears = (date: number, years: number) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d.getTime();
};

export const runSubscriptionEngine = async () => {
  // ✅ Prevent duplicate parallel runs
  if (isEngineRunning) return;
  isEngineRunning = true;

  try {
    const subs = await getSubscriptions();
    const today = Date.now();

    for (const sub of subs) {
      if (!sub.autoDebit) continue;

      // ✅ STRICT duplicate protection (PER CYCLE)
      if (
        sub.lastProcessedDate &&
        new Date(sub.lastProcessedDate).toDateString() ===
          new Date(sub.renewalDate).toDateString()
      ) {
        continue;
      }

      let currentRenewal = sub.renewalDate;
      let updated = false;

      // 🔥 Handle missed cycles safely
      while (currentRenewal <= today) {
        // ✅ ALWAYS FETCH LATEST TRANSACTIONS (IMPORTANT FIX)
        const transactions = await getTransactions();

        const alreadyExists = transactions.some(
          (t) =>
            t.category === `${sub.name} Subscription` &&
            Math.abs(t.createdAt - currentRenewal) <
              2 * 60 * 1000 // 🔥 2 min safety window
        );

        if (!alreadyExists) {
          await addTransaction({
            type:
              sub.paymentSource === "CREDIT"
                ? "CREDIT_SPEND"
                : "EXPENSE",
            amount: sub.amount,
            category: `${sub.name} Subscription`,
            bankAccountId: sub.bankAccountId,
            creditCardId: sub.creditCardId,
          });
        }

        // 🔁 Move to next cycle
        if (sub.billingCycle === "MONTHLY") {
          currentRenewal = addMonths(currentRenewal, 1);
        } else if (sub.billingCycle === "QUARTERLY") {
          currentRenewal = addMonths(currentRenewal, 3);
        } else if (sub.billingCycle === "YEARLY") {
          currentRenewal = addYears(currentRenewal, 1);
        }

        updated = true;
      }

      // ✅ Update AFTER processing
      if (updated) {
        await updateSubscription(sub.id, {
          renewalDate: currentRenewal,
          lastProcessedDate: sub.renewalDate,
        });
      }
    }
  } finally {
    // ✅ Release lock
    isEngineRunning = false;
  }
};