import { Markup } from "telegraf";

export const adminMenu = Markup.keyboard([
    ["👤 Foydalanuvchilar", "💳 To‘lovlar"],
    ["📊 Statistikalar", "🏠 Asosiy menyu"]
]).resize().oneTime();
