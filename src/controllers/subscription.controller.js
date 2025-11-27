import { UserService } from "../services/user.service.js";
import { Keyboards } from "../utils/keyboard.js";

const CHANNEL_ID = "@SmartDars_bot_news";

export const SubscriptionController = {
    async verify(ctx, bot) {
        const member = await bot.telegram.getChatMember(CHANNEL_ID, ctx.from.id);

        const allowed = ["member", "creator", "administrator"];
        if (!allowed.includes(member.status)) {
            return ctx.answerCbQuery("❌ Avval kanalga obuna bo‘ling!", true);
        }

        await UserService.updateSubscription(ctx.from.id, true);
        ctx.answerCbQuery("✅ Obuna tasdiqlandi!");

        ctx.reply("Tilni tanlang:", Keyboards.language());
    }
};
