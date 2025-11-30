import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";
import { ENV } from "../../config/envData.js";
import { Markup } from "telegraf";

export function SubscriptionController(bot) {
    // register action handler on the bot instance
    bot.action("verify_subscription", async (ctx) => {
        try {
            const member = await bot.telegram.getChatMember(ENV.CHANNEL_ID, ctx.from.id);
            const allowed = ["member", "administrator", "creator"];
            if (allowed.includes(member.status)) {
                const repo = AppDataSource.getRepository(User);
                await repo.update({ userId: ctx.from.id }, { isSubscribed: true });
                if (ctx.state.user) ctx.state.user.isSubscribed = true;
                await ctx.answerCbQuery("✅ Obuna tasdiqlandi");
                await ctx.reply("Obuna tasdiqlandi. Asosiy menyu:", {
                    reply_markup: {
                        keyboard: [
                            ["Prezentatsiya yaratish", "Quiz tuzish"],
                            ["Test javobini topish", "Narxlar"],
                            ["Xamyon", "Til"]
                        ]
                    }
                });
            } else {
                await ctx.answerCbQuery("❌ Avval kanalga obuna bo‘ling!", true);
            }
        } catch (err) {
            await ctx.answerCbQuery("❌ Xato! Iltimos kanalga obuna bo‘ling!", true);
        }
    });

    // you can return an object if you want methods available elsewhere
    return {
        verify: async (ctx) => {
            // delegate to same logic if needed
            await bot.handleUpdate(ctx.update);
        }
    };
}
