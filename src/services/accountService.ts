import { db } from "../db/db";
import { v4 as uuidv4 } from "uuid";

/* =======================
   🏦 BANK ACCOUNTS
======================= */

export const addAccount = async (name: string) => {
  await db.accounts.add({
    id: uuidv4(),
    name,
  });
};

export const getAccounts = async () => {
  return await db.accounts.toArray();
};

/* =======================
   💳 CREDIT CARDS
======================= */

export const addCreditCard = async (data: {
  name: string;
  totalLimit: number;
  customLimit?: number;
}) => {
  await db.creditCards.add({
    id: uuidv4(),
    name: data.name,
    totalLimit: data.totalLimit,
    customLimit: data.customLimit,
  });
};

export const getCreditCards = async () => {
  return await db.creditCards.toArray();
};

export const getCreditCardById = async (
  id: string
) => {
  return await db.creditCards.get(id);
};

/* =======================
   📊 MONTHLY CREDIT LIMIT
======================= */

const LIMIT_ID = "global_limit";

export const setMonthlyCreditSpendLimit = async (
  amount: number
) => {
  const existing = await db.limits.get(LIMIT_ID);

  if (existing) {
    await db.limits.update(LIMIT_ID, {
      creditMonthlyLimit: amount,
    });
  } else {
    await db.limits.add({
      id: LIMIT_ID,
      bankMonthlyLimit: 0,
      creditMonthlyLimit: amount,
    });
  }
};

export const getMonthlyCreditSpendLimit =
  async () => {
    const data = await db.limits.get(LIMIT_ID);

    return data?.creditMonthlyLimit || 0;
  };