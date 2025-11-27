import { config } from "dotenv";
config();

export const ENV = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT || 5432,
};
