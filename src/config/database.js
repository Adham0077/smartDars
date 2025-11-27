import { DataSource } from "typeorm";
import { ENV } from "./envData.js";
import { User } from "../entities/User.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: parseInt(ENV.DB_PORT),
    username: ENV.DB_USER,
    password: ENV.DB_PASS,
    database: ENV.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User],
});

export async function initDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("📌 Database connected!");
    } catch (error) {
        console.error("❌ Database Error:", error);
        process.exit(1);
    }
}
