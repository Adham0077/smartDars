import { Scenes } from "telegraf";
import { PRICE } from "../utils/price.js";
import { generatePresentationFile } from "../utils/fileGenerator.js";
import { askOpenAI } from "../utils/aiClient.js";

export const presentationScene = new Scenes.WizardScene(
    "PRESENTATION_SCENE",

    // STEP 1: slaydlar soni
    async (ctx) => {
        ctx.reply("❓ Prezentatsiya nechta slayddan iborat bo‘lsin?");
        ctx.wizard.state.presentation = {};
        return ctx.wizard.next();
    },

    // STEP 2: style tanlash
    async (ctx) => {
        ctx.wizard.state.presentation.slideCount = ctx.message.text;
        ctx.reply("🎨 Qaysi style tanlaysiz?\n\n1) Minimalist\n2) Corporate\n3) Dark\n4) Colorful");

        return ctx.wizard.next();
    },

    // STEP 3: til tanlash
    async (ctx) => {
        ctx.wizard.state.presentation.style = ctx.message.text;
        ctx.reply("🌍 Prezentatsiya qaysi tilda tayyorlansin?\n\nUZ / EN / RU");

        return ctx.wizard.next();
    },

    // STEP 4: Mavzu
    async (ctx) => {
        ctx.wizard.state.presentation.language = ctx.message.text;
        ctx.reply("✍️ Prezentatsiya mavzusini yozing:");

        return ctx.wizard.next();
    },

    // STEP 5: AI generatsiya jarayoni
    async (ctx) => {
        ctx.wizard.state.presentation.topic = ctx.message.text;

        const user = ctx.state.user;
        const prices = PRICE();

        // birinchi prezentatsiya — BEPUL
        const isFree = user.firstPresentationFree === true;

        if (!isFree && user.balance < prices.presentation) {
            ctx.reply("❌ Balansingizda mablag‘ yetarli emas.\n🔄 Xamyonga o'ting → /wallet");
            return ctx.scene.leave();
        }

        ctx.reply("⏳ Prezentatsiya tayyorlanmoqda...");

        const payload = ctx.wizard.state.presentation;
        const aiResult = await askOpenAI(payload);

        const filePath = await generatePresentationFile(aiResult);

        // balansdan yechish
        if (!isFree) {
            user.balance -= prices.presentation;
        } else {
            user.firstPresentationFree = false;
        }

        await ctx.state.userRepository.save(user);

        await ctx.replyWithDocument({ source: filePath, filename: "presentation.pptx" });

        return ctx.scene.leave();
    }
);
