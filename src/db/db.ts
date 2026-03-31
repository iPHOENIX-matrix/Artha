import Dexie from "dexie";

export interface BankAccount {
  id: string;
  name: string;
}

export interface CreditCard {
  id: string;
  name: string;
  totalLimit: number;
  customLimit?: number;
}

export type TransactionType =
  | "INCOME"
  | "EXPENSE"
  | "TRANSFER"
  | "CREDIT_SPEND"
  | "CREDIT_REPAY"
  | "FD_BOOKED";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category?: string;
  bankAccountId?: string;
  toBankAccountId?: string;
  creditCardId?: string;
  createdAt: number;
}

export interface FD {
  id: string;
  bankAccountId: string;
  amount: number;
  createdAt: number;
  maturityDate: number;
  status: "ACTIVE" | "WITHDRAWN";
  withdrawnAt?: number;
}

export interface SpendingLimit {
  id: string;
  bankMonthlyLimit: number;
  creditMonthlyLimit: number;
}

/* =========================
   🆕 FINANCE PLANNER TYPES
========================= */

export interface Plan {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: number;
  targetDate?: number; // ✅ NEW
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
   🆕 SUBSCRIPTIONS
========================= */

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: "MONTHLY" | "YEARLY" | "QUARTERLY";
  renewalDate: number;
  autoDebit: boolean;

  paymentSource?: "BANK" | "CREDIT";
  bankAccountId?: string;
  creditCardId?: string;

  lastProcessedDate?: number;
}

class ArthaDB extends Dexie {
  accounts!: Dexie.Table<BankAccount, string>;
  creditCards!: Dexie.Table<CreditCard, string>;
  transactions!: Dexie.Table<Transaction, string>;
  fds!: Dexie.Table<FD, string>;
  limits!: Dexie.Table<SpendingLimit, string>;

  plans!: Dexie.Table<Plan, string>;
  planTransactions!: Dexie.Table<PlanTransaction, string>;

  subscriptions!: Dexie.Table<Subscription, string>;

  constructor() {
    super("ArthaDB");

    this.version(2).stores({
      accounts: "id",
      creditCards: "id",
      transactions:
        "id, type, category, bankAccountId, toBankAccountId, creditCardId",
      fds: "id, bankAccountId",
      limits: "id",
    });

    this.version(3).stores({
      accounts: "id",
      creditCards: "id",
      transactions:
        "id, type, category, bankAccountId, toBankAccountId, creditCardId",
      fds: "id, bankAccountId",
      limits: "id",
      plans: "id",
      planTransactions: "id, planId, bankAccountId",
    });

    // ✅ NEW VERSION (SAFE UPGRADE)
    this.version(4).stores({
      accounts: "id",
      creditCards: "id",
      transactions:
        "id, type, category, bankAccountId, toBankAccountId, creditCardId",
      fds: "id, bankAccountId",
      limits: "id",
      plans: "id, targetDate",
      planTransactions: "id, planId, bankAccountId",
    });

    this.version(5).stores({
      accounts: "id",
      creditCards: "id",
      transactions:
        "id, type, category, bankAccountId, toBankAccountId, creditCardId",
      fds: "id, bankAccountId",
      limits: "id",
      plans: "id, targetDate",
      planTransactions: "id, planId, bankAccountId",

      // 🆕 NEW
      subscriptions: "id, renewalDate",
    });
  }
}

export const db = new ArthaDB();