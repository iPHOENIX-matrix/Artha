import type { Transaction, FD } from "../db/db";

export const calculateBalance = (
  transactions: Transaction[],
  accountId: string
) => {
  let balance = 0;

  transactions.forEach((t) => {
    if (t.type === "INCOME" && t.bankAccountId === accountId)
      balance += t.amount;

    if (t.type === "EXPENSE" && t.bankAccountId === accountId)
      balance -= t.amount;

    if (t.type === "TRANSFER" && t.bankAccountId === accountId)
      balance -= t.amount;

    if (t.type === "TRANSFER" && t.toBankAccountId === accountId)
      balance += t.amount;
  });

  return balance;
};

export const calculateTotalBalance = (
  transactions: Transaction[],
  fds: FD[] = []
) => {
  let total = 0;

  transactions.forEach((t) => {
    if (t.type === "INCOME") total += t.amount;
    if (t.type === "EXPENSE") total -= t.amount;
  });

  const fdTotal = fds.reduce((sum, fd) => sum + fd.amount, 0);

  return total + fdTotal;
};