import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

export const ENV = {
  BOT_TOKEN: String(process.env.BOT_TOKEN),
  DB_HOST: String(process.env.DB_HOST || "localhost"),
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_USER: String(process.env.DB_USER),
  DB_PASS: String(process.env.DB_PASS),
  DB_NAME: String(process.env.DB_NAME),
  OPENAI_API_KEY: String(process.env.OPENAI_API_KEY),
  ADMIN_IDS: (process.env.ADMIN_IDS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(String), // string sifatida aniq
  CHANNEL_ID: String(process.env.CHANNEL_ID),
  FILE_STORAGE_PATH: String(process.env.FILE_STORAGE_PATH || "./storage")
};

