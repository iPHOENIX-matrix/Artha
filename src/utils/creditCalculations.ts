import type { Transaction, CreditCard } from "../db/db";

/* ======================
   💳 PER CARD LOGIC
====================== */

export const calculateCreditUsed = (
  transactions: Transaction[],
  creditCardId: string
) => {
  return transactions.reduce((used, t) => {
    if (t.creditCardId !== creditCardId) return used;

    if (t.type === "CREDIT_SPEND") return used + t.amount;
    if (t.type === "CREDIT_REPAY") return used - t.amount;

    return used;
  }, 0);
};

export const calculateAvailableLimit = (
  totalLimit: number,
  used: number
) => {
  return totalLimit - used;
};

export const calculateRecommendedLimit = (
  totalLimit: number
) => {
  return totalLimit * 0.3;
};

/* ======================
   🔥 GLOBAL CREDIT LOGIC
====================== */

export const calculateTotalCreditUsed = (
  transactions: Transaction[]
) => {
  return transactions.reduce((total, t) => {
    if (t.type === "CREDIT_SPEND") return total + t.amount;
    if (t.type === "CREDIT_REPAY") return total - t.amount;

    return total;
  }, 0);
};

export const calculateTotalCreditLimit = (
  cards: CreditCard[]
) => {
  return cards.reduce(
    (sum, card) => sum + card.totalLimit,
    0
  );
};

export const calculateCreditUtilization = (
  used: number,
  totalLimit: number
) => {
  if (!totalLimit) return 0;

  return (used / totalLimit) * 100;
};