import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: { primary: true, type: "int", generated: true },
        userId: { type: "bigint", unique: true },
        username: { type: "varchar", nullable: true },
        firstName: { type: "varchar", nullable: true },
        lastName: { type: "varchar", nullable: true },
        language: { type: "varchar", default: "uz" },
        isSubscribed: { type: "boolean", default: false },
        firstPresentationUsed: { type: "boolean", default: false }, // first free
        firstQuizUsed: { type: "boolean", default: false }, // first free
        balance: { type: "bigint", default: 0 },
        createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});
