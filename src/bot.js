import { Telegraf, session, Markup } from "telegraf";
import { config } from "dotenv";
import { stage } from "./scenes/scenes.js";
import { ENV } from "./config/envData.js"

// Controllers
import { adminController } from "./modules/admin/controller.js";
import { paymentController } from "./modules/payment/controller.js";
import { SubscriptionController } from "./modules/subscription/controller.js";
import { StartController } from "./modules/menu/controller.js";
import { PresentationController } from "./modules/presentation/controller.js";
import { QuizController } from "./modules/quiz/controller.js";
import { TestController } from "./modules/tests/controller.js";
import { WalletController } from "./modules/wallet/controller.js";

// Middlewares
import { loadUser } from "./middlewares/loadUser.js";
import { checkSubscription } from "./middlewares/checkSubscription.js";
import { i18nMiddleware } from "./middlewares/i18n.js";

config();

const bot = new Telegraf(ENV.BOT_TOKEN);

// Session va Stage
bot.use(session());
bot.use(stage.middleware());

// Global middlewares
bot.use(loadUser);         // ctx.state.user ni o‘rnatadi
bot.use(i18nMiddleware);   // tilni ctx.i18n ga o‘rnatadi
bot.use(checkSubscription); // obuna tekshiradi

// Controllers
adminController(bot);
paymentController(bot);
SubscriptionController(bot);
StartController(bot);
PresentationController(bot);
QuizController(bot);
TestController(bot);
WalletController(bot);

// /start
bot.start(async (ctx) => {
    if (!ctx.state.user) return ctx.reply("❌ Foydalanuvchi topilmadi");
    ctx.reply(
        ctx.i18n.t("welcome"),
        Markup.keyboard([
            ["Prezentatsiya yaratish", "Quiz tayyorlash"],
            ["Test javob topish", "Narxlar"],
            ["Xamyon", "Tilni almashtirish"]
        ]).resize()
    );
});

export default bot;
