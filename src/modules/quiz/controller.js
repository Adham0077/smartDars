import { AppDataSource } from "../../config/database.js";
import { Quiz } from "../../entities/Quiz.js";
import { User } from "../../entities/User.js";
import { QuizQuestion } from "../../entities/QuizQuestion.js";
import { PRICE } from "../../utils/price.js";
import { askOpenAI } from "../../utils/aiClient.js";
import { Keyboards } from "../../utils/keyboard.js";

export function QuizController(bot) {

    // START — quiz yaratishni boshlash
    bot.hears(["Quiz tayyorlash", "❓ Quiz yaratish"], async (ctx) => {
        ctx.session.quiz = { step: "ask_language" };

        await ctx.reply(
            ctx.i18n.t("quiz.chooseLanguage"),
            Keyboards.languageMenu()
        );
    });

    // HAR BIR TEXT STEPNI QABUL QILADI
    bot.on("text", async (ctx) => {
        const s = ctx.session.quiz;
        if (!s) return; // sessiya yo‘q → quiz emas

        const text = ctx.message.text;
        const user = ctx.state.user;
        const quizRepo = AppDataSource.getRepository(Quiz);
        const questionRepo = AppDataSource.getRepository(QuizQuestion);
        const userRepo = AppDataSource.getRepository(User);

        // 1️⃣ Til tanlash
        if (s.step === "ask_language") {
            const map = {
                "🇺🇿 O'zbek": "uz",
                "🇬🇧 English": "en",
                "🇷🇺 Русский": "ru"
            };

            const lang = map[text] || text;

            if (!["uz", "en", "ru"].includes(lang))
                return ctx.reply("❗ Iltimos tilni tanlang");

            s.language = lang;
            s.step = "ask_count";

            return ctx.reply(
                ctx.i18n.t("quiz.askCount"),
                Keyboards.quizCount()
            );
        }

        // 2️⃣ Savollar soni
        if (s.step === "ask_count") {
            const count = Number(text);

            if (![5, 10, 20].includes(count))
                return ctx.reply("❗ 5, 10 yoki 20 tanlang");

            s.count = count;
            s.step = "ask_options";

            return ctx.reply(
                ctx.i18n.t("quiz.askOptions"),
                Keyboards.quizOptions()
            );
        }

        // 3️⃣ Variantlar soni
        if (s.step === "ask_options") {
            const opt = Number(text);

            if (opt < 2 || opt > 5)
                return ctx.reply("❗ Variantlar soni 2 dan 5 gacha bo‘lishi kerak");

            s.options = opt;
            s.step = "ask_topic";

            return ctx.reply(ctx.i18n.t("quiz.askTopic"));
        }

        // 4️⃣ Mavzu
        if (s.step === "ask_topic") {
            s.topic = text;

            // Narx hisoblash
            let price = s.count * PRICE.quizPerQuestion;
            if (!user.firstQuizUsed) price = 0;
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
            const quiz = quizRepo.create({
                userId: user.userId,
                title: s.topic,
                count: s.count,
                optionsPerQuestion: s.options,
                language: s.language,
                status: "pending",
                price
            });
            const savedQuiz = await quizRepo.save(quiz);

            // Balansdan yechish
            if (price > 0) {
                const newBalance = Number(user.balance) - price;
                await userRepo.update({ userId: user.userId }, { balance: newBalance });
                user.balance = newBalance;
            } else {
                await userRepo.update({ userId: user.userId }, { firstQuizUsed: true });
            }

            // AI orqali quiz yaratish
            await ctx.reply("⏳ Savollar yaratilmoqda...");

            const messages = [
                {
                    role: "system",
                    content: `Create ${s.count} MCQ quiz questions in ${s.language}. Provide JSON array.`
                },
                {
                    role: "user",
                    content: `Topic: ${s.topic}. Each question must have ${s.options} options and one correct answer.`
                }
            ];

            const aiAnswer = await askOpenAI(messages, 1500);

            let quizData;
            try {
                quizData = JSON.parse(aiAnswer);
            } catch (e) {
                return ctx.reply("❗ AI noto‘g‘ri format qaytardi. Iltimos qayta urinib ko‘ring.");
            }

            // Quiz savollarni saqlash
            for (let q of quizData) {
                const entity = questionRepo.create({
                    quizId: savedQuiz.id,
                    question: q.question,
                    options: JSON.stringify(q.options),
                    correctAnswer: q.correctAnswer
                });
                await questionRepo.save(entity);
            }

            // Yakuniy javob
            await quizRepo.update(
                { id: savedQuiz.id },
                { status: "ready" }
            );

            s.step = null;

            await ctx.reply("🎉 Quiz tayyor va saqlandi!");
            return ctx.reply(
                ctx.i18n.t("menu.mainMenu"),
                Keyboards.mainMenu(ctx.i18n.t.bind(ctx.i18n))
            );
        }
    });
}
