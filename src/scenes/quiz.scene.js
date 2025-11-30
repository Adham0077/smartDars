import { Scenes } from "telegraf";
import { PRICE } from "../utils/price.js";
import { askOpenAI } from "../utils/aiClient.js";

export const quizScene = new Scenes.WizardScene(
    "QUIZ_SCENE",

    async (ctx) => {
        ctx.reply("❓ Nechta savoldan iborat quiz tayyorlaymiz?");
        ctx.wizard.state.quiz = {};
        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.quiz.questionCount = ctx.message.text;
        ctx.reply("🔢 Har bir savol uchun nechta variant bo‘lsin?");
        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.quiz.optionCount = ctx.message.text;
        ctx.reply("🌍 Quiz qaysi tilda bo‘lsin?\nUZ / EN / RU");
        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.quiz.language = ctx.message.text;
        ctx.reply("✍️ Quiz mavzusini yozing:");
        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.quiz.topic = ctx.message.text;

        const user = ctx.state.user;
        const prices = PRICE();
        const price = prices.quiz;

        const isFree = user.firstQuizFree === true;

        if (!isFree && user.balance < price) {
            ctx.reply("❌ Balansingiz yetarli emas. /wallet");
            return ctx.scene.leave();
        }

        ctx.reply("⏳ Quiz tayyorlanmoqda...");

        const data = ctx.wizard.state.quiz;
        const quiz = await askOpenAI(data);

        if (!isFree) {
            user.balance -= price;
        } else {
            user.firstQuizFree = false;
        }

        await ctx.state.userRepository.save(user);

        ctx.reply("📘 Tayyor quiz:\n\n" + quiz);

        return ctx.scene.leave();
    }
);
