import { db } from "../db/db";

export const addSubscription = async (data: any) => {
  await db.subscriptions.add({
    id: crypto.randomUUID(),
    ...data,
    lastProcessedDate: 0,
  });
};

export const getSubscriptions = async () => {
  return await db.subscriptions.toArray();
};

export const deleteSubscription = async (id: string) => {
  await db.subscriptions.delete(id);
};

export const updateSubscription = async (
  id: string,
  updates: any
) => {
  await db.subscriptions.update(id, updates);
};