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

class ArthaDB extends Dexie {
  accounts!: Dexie.Table<BankAccount, string>;
  creditCards!: Dexie.Table<CreditCard, string>;
  transactions!: Dexie.Table<Transaction, string>;
  fds!: Dexie.Table<FD, string>;
  limits!: Dexie.Table<SpendingLimit, string>;

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
  }
}

export const db = new ArthaDB();