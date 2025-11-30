import { EntitySchema } from "typeorm";

export const QuizQuestion = new EntitySchema({
    name: "QuizQuestion",
    tableName: "quiz_questions",
    columns: {
        id: { primary: true, type: "int", generated: true },
        quizId: { type: "int" },
        question: { type: "text" },
        options: { type: "text" }, // JSON stringified
        answer: { type: "varchar", nullable: true }, // correct answer
    },
});
