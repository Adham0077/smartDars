import { UserService } from "../services/user.service.js";
import { uzbek } from "../languages/uzbek.js";
import { english } from "../languages/english.js";
import { russian } from "../languages/russian.js";

export const LanguageController = {
    async set(lang, ctx, bot) {
        await UserService.setLanguage(ctx.from.id, lang);

        if (lang === "uz") return uzbek(bot, ctx);
        if (lang === "en") return english(bot, ctx);
        if (lang === "ru") return russian(bot, ctx);
    }
};
