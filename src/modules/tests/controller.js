import { askOpenAI } from "../../utils/aiClient.js";
import { PRICE } from "../../utils/price.js";
import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";

export function TestController(bot) {
    // /test buyrug‘i
    bot.command("test", async (ctx) => {
        ctx.session.test = { step: "await_text" };
        await ctx.reply("Iltimos test yoki savollar matnini yuboring. Har bir savol uchun to‘lov olinadi.");
    });

    // Matn qabul qilish
    bot.on("text", async (ctx) => {
        const s = ctx.session.test;
        if (!s || s.step !== "await_text") return;

        const text = ctx.message?.text;
        if (!text) return;

        const user = ctx.state.user;
        const userRepo = AppDataSource.getRepository(User);

        // Testni nechta ekanini aniqlash
        const approxQuestions = (text.match(/\n?\s*\d+\)/g) || []).length || 1;

        // Narxni hisoblash
        let price = approxQuestions * PRICE.testPerQuestion;
        if (!user.firstTestUsed) price = 0;

        // Balans yetadimi?
        if (price > 0 && Number(user.balance) < price) {
            return ctx.reply("Balansingiz yetarli emas. Iltimos to‘ldiring.");
        }

        // Balansdan yechish yoki bepul flagni belgilash
        if (price > 0) {
            user.balance = Number(user.balance) - price;
            await userRepo.update({ userId: user.userId }, { balance: user.balance });
        } else {
            await userRepo.update({ userId: user.userId }, { firstTestUsed: true });
        }

        // AI javobi
        const messages = [
            { role: "system", content: "Siz testlarni yechuvchi professional AI assistantsiz." },
            { role: "user", content: `Quyidagi testlarga tartibli javob yozing:\n\n${text}` }
        ];

        const result = await askOpenAI(messages, 1200);

        await ctx.reply("Javoblar tayyor:\n\n" + result);

        s.step = null;
    });
}
