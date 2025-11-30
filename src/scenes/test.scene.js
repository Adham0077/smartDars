import { Scenes } from "telegraf";
import { PRICE } from "../utils/price.js";
import { askOpenAI } from "../utils/aiClient.js";

export const testScene = new Scenes.WizardScene(
    "TEST_SCENE",

    async (ctx) => {
        ctx.reply("📝 Test savollaringizni yuboring:");
        return ctx.wizard.next();
    },

    async (ctx) => {
        const user = ctx.state.user;
        const prices = PRICE();

        if (user.balance < prices.test) {
            ctx.reply("❌ Balans yetarli emas. /wallet");
            return ctx.scene.leave();
        }

        ctx.reply("⏳ Javoblar tayyorlanmoqda...");

        const result = await askOpenAI(ctx.message.text);

        user.balance -= prices.test;
        await ctx.state.userRepository.save(user);

        ctx.reply("📘 Test javoblari:\n\n" + result);

        return ctx.scene.leave();
    }
);
