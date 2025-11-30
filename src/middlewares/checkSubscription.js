import { ENV } from "../config/envData.js";

export function checkSubscription(bot) {
    return async (ctx, next) => {
        try {
            // Allow admins bypass
            const adminIds = ENV.ADMIN_IDS.map(id => Number(id));
            if (adminIds.includes(Number(ctx.from?.id))) return next();

            const repo = ctx.app?.dataSource?.getRepository?.("User") || null;
            // if user state has isSubscribed true -> ok
            if (ctx.state?.user?.isSubscribed) return next();

            // Use Telegram getChatMember
            try {
                const member = await bot.telegram.getChatMember(ENV.CHANNEL_ID, ctx.from.id);
                const allowed = ["member", "creator", "administrator"];
                if (allowed.includes(member.status)) {
                    // update DB
                    const userRepo = ctx.app ? ctx.app.dataSource.getRepository("User") : null;
                    if (ctx.state.user) {
                        ctx.state.user.isSubscribed = true;
                        await ctx.state.user.save?.(); // not always available
                    }
                    return next();
                }
            } catch (err) {
                // ignore
            }

            // ask to subscribe
            return ctx.reply("Kanalga obuna bo‘ling", { reply_markup: { inline_keyboard: [[{ text: "Kanalga obuna bo‘lish", url: `https://t.me/${ENV.CHANNEL_ID.replace('@', '')}` }, { text: "Tasdiqlash", callback_data: "verify_subscription" }]] } });
        } catch (err) {
            console.error("checkSubscription middleware error", err);
            return next();
        }
    };
}
