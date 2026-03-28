import { db } from "../db/db";

export const createFD = async (data: {
  bankAccountId: string;
  amount: number;
  maturityDate: number;
  deductFromBank: boolean;
}) => {
  const time = Date.now();

  await db.fds.add({
    id: crypto.randomUUID(),
    bankAccountId: data.bankAccountId,
    amount: data.amount,
    createdAt: time,
    maturityDate: data.maturityDate,
    status: "ACTIVE",
  });

  await db.transactions.add({
    id: crypto.randomUUID(),
    type: "FD_BOOKED",
    amount: data.amount,
    category: "FD Created",
    bankAccountId: data.bankAccountId,
    createdAt: time,
  });

  if (data.deductFromBank) {
    await db.transactions.add({
      id: crypto.randomUUID(),
      type: "EXPENSE",
      amount: data.amount,
      category: "FD Deduction",
      bankAccountId: data.bankAccountId,
      createdAt: time,
    });
  }
};

export const withdrawFD = async (id: string) => {
  const fd = await db.fds.get(id);
  if (!fd) return;

  await db.fds.update(id, {
    status: "WITHDRAWN",
    withdrawnAt: Date.now(),
  });

  await db.transactions.add({
    id: crypto.randomUUID(),
    type: "INCOME",
    amount: fd.amount,
    category: "FD Withdrawn",
    bankAccountId: fd.bankAccountId,
    createdAt: Date.now(),
  });
};

export const deleteFD = async (id: string) => {
  await db.fds.delete(id);
};

export const getFDs = async () => {
  return await db.fds.toArray();
};