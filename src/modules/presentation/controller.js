import { Keyboards } from "../../utils/keyboard.js";
import { AppDataSource } from "../../config/database.js";
import { Presentation } from "../../entities/Presentation.js";
import { User } from "../../entities/User.js";
import { PRICE } from "../../utils/price.js";
import { askOpenAI } from "../../utils/aiClient.js";
import { generatePresentationFile } from "../../utils/fileGenerator.js";

export function PresentationController(bot) {

    // 🔵 Boshlanish
    bot.hears(["Prezentatsiya yaratish"], async (ctx) => {
        ctx.session.presentation = { step: "ask_language" };

        await ctx.reply(
            ctx.i18n.t("presentation.chooseLanguage"),
            Keyboards.languageMenu()
        );
    });

    // 🔵 Har bir text step ni boshqarish
    bot.on("text", async (ctx) => {
        const s = ctx.session.presentation;
        if (!s) return; // session yo‘q → chiqamiz

        const msg = ctx.message.text;
        const user = ctx.state.user;
        const repo = AppDataSource.getRepository(Presentation);
        const userRepo = AppDataSource.getRepository(User);

        // 1) Til tanlash
        if (s.step === "ask_language") {
            const map = {
                "🇺🇿 O'zbek": "uz",
                "🇬🇧 English": "en",
                "🇷🇺 Русский": "ru",
            };

            const lang = map[msg] || msg;
            if (!["uz", "ru", "en"].includes(lang))
                return ctx.reply("❗ Iltimos, tildan birini tanlang");

            s.language = lang;
            s.step = "ask_slides";

            return ctx.reply(
                ctx.i18n.t("presentation.askSlides"),
                Keyboards.slidesOptions()
            );
        }

        // 2) Slaydlar soni
        if (s.step === "ask_slides") {
            const slides = Number(msg);

            if (![5, 10, 15].includes(slides))
                return ctx.reply("❗ 5, 10 yoki 15 slayd tanlang");

            s.slides = slides;
            s.step = "ask_style";

            return ctx.reply(
                ctx.i18n.t("presentation.askStyle"),
                Keyboards.styleOptions()
            );
        }

        // 3) Style
        if (s.step === "ask_style") {
            s.style = msg;
            s.step = "ask_topic";

            return ctx.reply(
                ctx.i18n.t("presentation.askTopic"),
                Keyboards.backMenu()
            );
        }

        // 4) Mavzu
        if (s.step === "ask_topic") {
            s.topic = msg;

            // narx hisoblash
            let price = s.slides * PRICE.presentationPerSlide;

            // Birinchi prezentatsiya BЕPUL
            if (!user.firstPresentationUsed) price = 0;

            s.price = price;

            // Balans tekshirish
            if (price > 0 && Number(user.balance) < price) {
                s.step = null;
                return ctx.reply(
                    ctx.i18n.t("wallet.notEnoughBalance"),
                    Keyboards.walletTopup()
                );
            }

            // DB yaratish
            const entity = repo.create({
                userId: user.userId,
                slides: s.slides,
                style: s.style,
                topic: s.topic,
                language: s.language,
                status: "pending",
                price: price
            });

            const saved = await repo.save(entity);

            // Balansdan yechish (agar pullik bo‘lsa)
            if (price > 0) {
                const newBalance = Number(user.balance) - price;
                await userRepo.update(
                    { userId: user.userId },
                    { balance: newBalance }
                );
                user.balance = newBalance;
            } else {
                await userRepo.update(
                    { userId: user.userId },
                    { firstPresentationUsed: true }
                );
            }

            // 🔵 AI slayd yaratish
            const messages = [
                {
                    role: "system",
                    content: `Generate presentation with ${s.slides} slides. Language: ${s.language}. Style: ${s.style}`
                },
                {
                    role: "user",
                    content: `Topic: ${s.topic}`
                }
            ];

            const aiText = await askOpenAI(messages, 1300);

            const slidesContent = aiText
                .split(/\n{2,}/)
                .slice(0, s.slides)
                .map(t => t.trim());

            // 🔵 Fayl yaratish
            const filePath = await generatePresentationFile({
                slidesContent,
                title: s.topic
            });

            await repo.update(
                { id: saved.id },
                { fileUrl: filePath, status: "ready" }
            );

            // 🔵 Foydalanuvchiga yuborish
            await ctx.replyWithDocument({
                source: filePath,
                filename: `presentation_${saved.id}.pptx`
            });

            s.step = null;
            return ctx.reply(
                ctx.i18n.t("presentation.ready"),
                Keyboards.mainMenu(ctx.i18n.t.bind(ctx.i18n))
            );
        }
    });
}
