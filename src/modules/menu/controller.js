// src/modules/menu/controller.js
import { Keyboards } from "../../utils/keyboard.js";
import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";
import { ENV } from "../../config/envData.js";

export function StartController(bot) {
    // /start
    bot.start(async (ctx) => {
        const user = ctx.state.user;

        if (!user) return ctx.reply("❌ User topilmadi");

        // Obuna bo‘lmagan bo‘lsa → kanalga taklif
        if (!user.isSubscribed) {
            return ctx.reply(
                ctx.i18n.t("menu.subscribePrompt") || "📢 Avval kanalga obuna bo‘ling!",
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "📢 Kanalga obuna bo‘lish", url: `https://t.me/${ENV.CHANNEL_ID.replace("@", "")}` }
                            ],
                            [
                                { text: "✅ Tekshirish", callback_data: "verify_subscription" }
                            ]
                        ]
                    }
                }
            );
        }

        // Asosiy menyu
        return ctx.reply(
            ctx.i18n.t("menu.welcome") || "Xush kelibsiz!",
            Keyboards.mainMenu(ctx.i18n.t.bind(ctx.i18n))
        );
    });

    // 💬 Tilni tanlash callback
    bot.action(/^set_lang_(uz|ru|en)$/, async (ctx) => {
        const lang = ctx.match[1];
        const repo = AppDataSource.getRepository(User);

        await repo.update({ userId: ctx.from.id }, { language: lang });

        if (ctx.state.user) ctx.state.user.language = lang;

        await ctx.answerCbQuery("Til o‘zgartirildi");
        await ctx.reply(
            ctx.i18n.t("menu.languageChanged"),
            Keyboards.mainMenu(ctx.i18n.t.bind(ctx.i18n))
        );
    });

    // 💰 Narxlar
    bot.hears(["Narxlar", "Prices", "Цены"], async (ctx) => {
        const p = (await import("../../utils/price.js")).PRICE;

        await ctx.reply(
            `💰 Narxlar:\n\n` +
            `📊 Prezentatsiya: ${p.presentationPerSlide} so'm (1 slayd)\n` +
            `❓ Quiz: ${p.quizPerQuestion} so'm (1 savol)\n` +
            `🧪 Test: ${p.testPerQuestion} so'm (1 savol)`
        );
    });
}
