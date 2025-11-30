import { Markup } from "telegraf";

export const walletMenu = Markup.inlineKeyboard([
    [
        Markup.button.callback("💰 Balansni ko‘rish", "view_balance"),
        Markup.button.callback("➕ Balansni to‘ldirish", "add_balance")
    ],
    [
        Markup.button.callback("🏠 Asosiy menyuga", "main_menu")
    ]
]);
