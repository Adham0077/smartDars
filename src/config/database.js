import { DataSource } from "typeorm";
import { ENV } from "./envData.js";
import { User } from "../entities/User.js";
import { WalletTransaction } from "../entities/WalletTransaction.js";
import { Presentation } from "../entities/Presentation.js";
import { Quiz } from "../entities/Quiz.js";
import { QuizQuestion } from "../entities/QuizQuestion.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: ENV.DB_HOST,
  port: parseInt(ENV.DB_PORT, 10) || 5432,
  username: ENV.DB_USER,
  password: ENV.DB_PASS,
  database: ENV.DB_NAME,
  synchronize: true, // dev only; in prod use migrations
  logging: false,
  entities: [User, WalletTransaction, Presentation, Quiz, QuizQuestion],
});
export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("✅ PostgreSQL connected");
  } catch (err) {
    console.error("❌ DB init error:", err);
    process.exit(1);
  }
}
