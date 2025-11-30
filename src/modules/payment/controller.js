import { Scenes, Markup } from "telegraf";
import { registerPayment } from "./service.js";
import { getMainMenuKeyboard } from "../menu/service.js";

export async function paymentController(bot) {
    // Payment scene start
    bot.command("wallet", (ctx) => {
        ctx.scene.enter("WALLET_SCENE");
    });

    // Inline tugmalar orqali to‘lov
    bot.action(/pay_(\d+)/, async (ctx) => {
        const amount = parseInt(ctx.match[1]);
        const user = ctx.state.user;
        const paymentRepository = ctx.state.paymentRepository;

        try {
            const payment = await registerPayment(user, ctx.state.userRepository, paymentRepository, amount, "pending");

            ctx.reply(
                `💳 To‘lov ${amount} so‘m uchun ro‘yxatga olindi.\n\n` +
                `Admin tasdiqlaguncha kuting.`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("🏠 Asosiy menyuga", "main_menu")]
                ])
            );
        } catch (error) {
            ctx.reply(`❌ To‘lovni ro‘yxatga olishda xato: ${error.message}`);
        }

        await ctx.answerCbQuery();
    });

    // Asosiy menyuga qaytish tugmasi
    bot.action("main_menu", (ctx) => {
        ctx.reply("🏠 Asosiy menyu", Markup.keyboard(getMainMenuKeyboard()).resize().oneTime());
        ctx.answerCbQuery();
    });
}
