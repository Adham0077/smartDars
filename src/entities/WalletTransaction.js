import { EntitySchema } from "typeorm";

export const WalletTransaction = new EntitySchema({
  name: "WalletTransaction",
  tableName: "wallet_transactions",
  columns: {
    id: { primary: true, type: "int", generated: true },
    userId: { type: "bigint" },
    amount: { type: "bigint" },
    type: { type: "varchar" }, // 'topup' | 'purchase'
    status: { type: "varchar", default: "pending" }, // pending, approved, rejected
    meta: { type: "text", nullable: true },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
});
