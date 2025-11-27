import { UserService } from "../services/user.service.js";
import { Keyboards } from "../utils/keyboard.js";

const CHANNEL_URL = "https://t.me/SmartDars_bot_news";

export const StartController = {
    async start(ctx) {
        const user = await UserService.findOrCreate(ctx);

        if (user.isSubscribed) {
            return ctx.reply("Tilni tanlang:", Keyboards.language());
        }

        ctx.reply(
            "Botdan foydalanish uchun kanalga obuna bo‘ling:",
            Keyboards.subscribe(CHANNEL_URL)
        );
    }
};
