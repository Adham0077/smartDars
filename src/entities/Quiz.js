import { EntitySchema } from "typeorm";

export const Quiz = new EntitySchema({
    name: "Quiz",
    tableName: "quizzes",
    columns: {
        id: { primary: true, type: "int", generated: true },
        userId: { type: "bigint" },
        title: { type: "varchar", nullable: true },
        count: { type: "int" },
        optionsPerQuestion: { type: "int" },
        language: { type: "varchar" },
        status: { type: "varchar", default: "pending" },
        fileUrl: { type: "varchar", nullable: true },
        price: { type: "bigint", default: 0 },
        createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    },
});
