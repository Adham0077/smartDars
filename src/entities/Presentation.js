import { EntitySchema } from "typeorm";

export const Presentation = new EntitySchema({
    name: "Presentation",
    tableName: "presentations",
    columns: {
        id: { primary: true, type: "int", generated: true },
        userId: { type: "bigint" },
        slides: { type: "int" },
        style: { type: "varchar" },
        topic: { type: "text" },
        language: { type: "varchar" },
        status: { type: "varchar", default: "pending" }, // pending, ready, failed
        fileUrl: { type: "varchar", nullable: true },
        price: { type: "bigint", default: 0 },
        createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    },
});
