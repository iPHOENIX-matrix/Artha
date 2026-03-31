import { db } from "../db/db";
import { v4 as uuidv4 } from "uuid";

/* =========================
   📦 TYPES
========================= */

export interface Plan {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: number;
  targetDate?: number; // ✅ already supported
}

export interface PlanTransaction {
  id: string;
  planId: string;
  amount: number;
  bankAccountId: string;
  type: "SAVE" | "WITHDRAW";
  createdAt: number;
}

/* =========================
   📊 PLAN CRUD
========================= */

export const getPlans = async () => {
  return await db.plans.toArray();
};

export const createPlan = async ({
  title,
  targetAmount,
  targetDate,
}: {
  title: string;
  targetAmount: number;
  targetDate?: number;
}) => {
  await db.plans.add({
    id: uuidv4(),
    title,
    targetAmount,
    savedAmount: 0,
    createdAt: Date.now(),
    targetDate,
  });
};

export const addToPlan = async ({
  planId,
  amount,
  bankAccountId,
}: {
  planId: string;
  amount: number;
  bankAccountId: string;
}) => {
  const plan = await db.plans.get(planId);
  if (!plan) return;

  await db.planTransactions.add({
    id: uuidv4(),
    planId,
    amount,
    bankAccountId,
    type: "SAVE",
    createdAt: Date.now(),
  });

  await db.plans.update(planId, {
    savedAmount: plan.savedAmount + amount,
  });
};

export const withdrawFromPlan = async ({
  planId,
  amount,
  bankAccountId,
}: {
  planId: string;
  amount: number;
  bankAccountId: string;
}) => {
  const plan = await db.plans.get(planId);
  if (!plan) return;

  await db.planTransactions.add({
    id: uuidv4(),
    planId,
    amount,
    bankAccountId,
    type: "WITHDRAW",
    createdAt: Date.now(),
  });

  await db.plans.update(planId, {
    savedAmount: Math.max(0, plan.savedAmount - amount),
  });
};

export const getPlanTransactions = async (planId: string) => {
  return await db.planTransactions
    .where("planId")
    .equals(planId)
    .toArray();
};

/* =========================
   🗑️ DELETE TRANSACTION
========================= */

export const deletePlanTransaction = async (txnId: string) => {
  const txn = await db.planTransactions.get(txnId);
  if (!txn) return;

  const plan = await db.plans.get(txn.planId);
  if (!plan) return;

  // Reverse effect
  let updatedAmount = plan.savedAmount;

  if (txn.type === "SAVE") {
    updatedAmount -= txn.amount;
  } else {
    updatedAmount += txn.amount;
  }

  await db.plans.update(txn.planId, {
    savedAmount: Math.max(0, updatedAmount),
  });

  await db.planTransactions.delete(txnId);
};