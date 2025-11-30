import { Markup } from "telegraf";

export const languageMenu = Markup.inlineKeyboard([
    [
        Markup.button.callback("🇺🇿 O'zbek", "select_uz"),
        Markup.button.callback("🇬🇧 English", "select_en")
    ],
    [
        Markup.button.callback("🇷🇺 Русский", "select_ru")
    ]
]);
