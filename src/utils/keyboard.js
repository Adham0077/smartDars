import { Markup } from "telegraf";

export const Keyboards = {
    mainMenu: (i18n) => Markup.keyboard([
        [i18n("menu.presentation"), i18n("menu.quiz")],
        [i18n("menu.solveTest"), i18n("menu.prices")],
        [i18n("menu.wallet"), i18n("menu.language")],
    ]).resize(),

    backMenu: (i18n) => Markup.keyboard([[i18n("menu.back"), i18n("menu.main")]]).resize(),

    slidesOptions: (i18n) => Markup.keyboard([["5", "10", "15"], [i18n("menu.back")]]).resize(),
    styleOptions: (i18n) => Markup.keyboard([["Minimal", "Business"], ["Modern", i18n("menu.back")]]).resize(),

    walletTopup: (i18n) => Markup.keyboard([["5000", "10000"], ["20000", i18n("menu.back")]]).resize(),

    languageMenu: Markup.inlineKeyboard([
        [Markup.button.callback("🇺🇿 O'zbek", "lang_uz"), Markup.button.callback("🇬🇧 English", "lang_en")],
        [Markup.button.callback("🇷🇺 Русский", "lang_ru")]
    ])
};
