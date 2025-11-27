import { Telegraf } from "telegraf";
import { ENV } from "./config/env.js";

import { StartController } from "./controllers/start.controller.js";
import { SubscriptionController } from "./controllers/subscription.controller.js";
import { LanguageController } from "./controllers/language.controller.js";

export const bot = new Telegraf(ENV.BOT_TOKEN);

bot.start((ctx) => StartController.start(ctx));

bot.action("verify_subscription", (ctx) =>
    SubscriptionController.verify(ctx, bot)
);

bot.action("lang_uz", (ctx) => LanguageController.set("uz", ctx, bot));
bot.action("lang_en", (ctx) => LanguageController.set("en", ctx, bot));
bot.action("lang_ru", (ctx) => LanguageController.set("ru", ctx, bot));
