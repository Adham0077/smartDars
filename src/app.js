import bot from "./bot.js";
import { initializeDatabase } from "./config/database.js";
import { config } from "dotenv";

config();

async function start() {
    try {
        // DB connect
        await initializeDatabase();

        console.log("✅ Database connected");

        // Bot ishga tushirish
        try {
            await bot.launch();
            console.log("🤖 Bot started");
        } catch (err) {
            console.error("Bot launch error:", err);
        }
        process.once("SIGINT", () => bot.stop("SIGINT"));
        process.once("SIGTERM", () => bot.stop("SIGTERM"));
    } catch (error) {
        console.error("❌ App start error:", error);
    }
}

start();
