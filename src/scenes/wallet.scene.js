import { Scenes } from "telegraf";

export const walletScene = new Scenes.WizardScene(
    "WALLET_SCENE",

    async (ctx) => {
        const user = ctx.state.user;
        ctx.reply(`💰 Balansingiz: ${user.balance} so‘m\n\nQancha to‘ldirmoqchisiz?\n10 000 / 20 000 / 50 000 / 100 000`);
        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.amount = ctx.message.text;
        ctx.reply("💳 To‘lov uchun karta: 8600 1234 5678 9101\n\nChek skrinshotini yuboring:");
        return ctx.wizard.next();
    },

    async (ctx) => {
        const paymentImage = ctx.message.photo?.pop();

        ctx.telegram.sendPhoto(
            process.env.ADMIN_ID,
            paymentImage.file_id,
            { caption: `💸 Yangi to‘lov: ${ctx.wizard.state.amount} so‘m\nUser: ${ctx.from.id}` }
        );

        ctx.reply("⏳ To‘lov tekshirilmoqda. Admin tasdiqlaganidan so‘ng balansingiz to‘ldiriladi.");

        return ctx.scene.leave();
    }
);
