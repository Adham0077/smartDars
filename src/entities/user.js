import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            generationStrategy: "increment",
        },
        userId: {
            type: "bigint",
            unique: true,
        },
        username: {
            type: "varchar",
            nullable: true,
        },
        firstName: {
            type: "varchar",
            nullable: true,
        },
        lastName: {
            type: "varchar",
            nullable: true,
        },
        language: {
            type: "varchar",
            default: "uz",
        },
        isSubscribed: {
            type: "boolean",
            default: false,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

