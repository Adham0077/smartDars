import { Markup } from "telegraf";

export const Keyboards = {
    subscribe: (url) => Markup.inlineKeyboard([
        [
            Markup.button.url("📢 Kanalga obuna bo‘lish", url),
            Markup.button.callback("✅ Tasdiqlash", "verify_subscription")
        ]
    ]),

    language: () => Markup.inlineKeyboard([
        [
            Markup.button.callback("🇺🇿 O'zbek", "lang_uz"),
            Markup.button.callback("🇬🇧 English", "lang_en")
        ],
        [Markup.button.callback("🇷🇺 Русский", "lang_ru")]
    ])
};
