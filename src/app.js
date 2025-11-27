import { initDatabase } from "./config/database.js";
import { bot } from "./bot.js";

async function start() {
    await initDatabase();
    bot.launch();
    console.log("🤖 Bot is running...");
}

start();

