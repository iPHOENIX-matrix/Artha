import { db } from "../db/db";

export const addTransaction = async (data: {
  type:
    | "INCOME"
    | "EXPENSE"
    | "CREDIT_SPEND"
    | "CREDIT_REPAY"
    | "FD_BOOKED";
  amount: number;
  category?: string;
  bankAccountId?: string;
  creditCardId?: string;
}) => {
  await db.transactions.add({
    id: crypto.randomUUID(),
    type: data.type,
    amount: data.amount,
    category: data.category,
    bankAccountId: data.bankAccountId,
    creditCardId: data.creditCardId,
    createdAt: Date.now(),
  });
};

export const deleteTransaction = async (id: string) => {
  await db.transactions.delete(id);
};

export const transferMoney = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number
) => {
  await db.transactions.add({
    id: crypto.randomUUID(),
    type: "TRANSFER",
    amount,
    bankAccountId: fromAccountId,
    toBankAccountId: toAccountId,
    createdAt: Date.now(),
  });
};

export const getTransactions = async () => {
  return await db.transactions.toArray();
};