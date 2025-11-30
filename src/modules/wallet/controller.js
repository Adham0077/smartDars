import { AppDataSource } from "../../config/database.js";
import { WalletTransaction } from "../../entities/WalletTransaction.js";
import { User } from "../../entities/User.js";
import { Keyboards } from "../../utils/keyboard.js";
import { ENV } from "../../config/envData.js";

const txRepo = () => AppDataSource.getRepository(WalletTransaction);
const userRepo = () => AppDataSource.getRepository(User);

export function WalletController(bot) {

    // === XAMYON ===
    bot.hears(["Xamyon", "💰 Xamyon"], async (ctx) => {
        const user = ctx.state.user;

        await ctx.reply(
            `💰 Balansingiz: ${user.balance} so'm`,
            Keyboards.walletTopup(ctx.i18n.t.bind(ctx.i18n))
        );
    });

    // === SUMMA TANLASH HANDLER ===
    bot.action(/topup_(\d+)/, async (ctx) => {
        const amount = Number(ctx.match[1]);
        await ctx.answerCbQuery();
        return topupRequest(ctx, amount);
    });

    // === PHOTO QABUL QILISH ===
    bot.on("photo", async (ctx) => {
        return handlePhoto(ctx);
    });
}

/** ↓↓↓--- FUNKSIYALAR ---↓↓↓ */

async function topupRequest(ctx, amount) {
    const user = ctx.state.user;

    const tx = txRepo().create({
        userId: user.userId,
        amount,
        type: "topup",
        status: "pending",
        meta: JSON.stringify({ requestedAt: new Date().toISOString() })
    });

    await txRepo().save(tx);

    const card = ENV.CARD_NUMBER || "8600 XXXX XXXX XXXX";

    await ctx.reply(
        `💳 To‘lov summasi: *${amount} so'm*\n\n` +
        `Quyidagi kartaga yuboring:\n` +
        `*${card}*\n\n` +
        `Chekni shu chatga yuboring.\n` +
        `🆔 TX ID: *${tx.id}*`,
        { parse_mode: "Markdown" }
    );
}

async function handlePhoto(ctx) {
    const tgId = ctx.from.id;

    const user = await userRepo().findOne({ where: { tgId } });
    if (!user) return ctx.reply("❌ /start ni bosib qayta urinib ko‘ring");

    const pending = await txRepo().findOne({
        where: { userId: user.userId, status: "pending" },
        order: { id: "DESC" }
    });

    if (!pending) {
        return ctx.reply("❗ Avval to‘lov summasini tanlang.");
    }

    const photoArr = ctx.message.photo;
    const fileId = photoArr[photoArr.length - 1].file_id;

    // Adminlarga yuborish
    const adminIds = (ENV.ADMIN_IDS || "")
        .split(",")
        .map(id => id.trim())
        .filter(Boolean);

    for (const admin of adminIds) {
        try {
            await ctx.telegram.sendPhoto(
                admin,
                fileId,
                {
                    caption:
                        `🧾 Yangi to‘lov tekshiruvi\n\n` +
                        `👤 User: ${user.fullName || "Noma'lum"}\n` +
                        `🆔 Telegram: ${user.tgId}\n` +
                        `💸 Summa: ${pending.amount} so'm\n` +
                        `TX ID: ${pending.id}`
                }
            );
        } catch (err) {
            console.error("Admin xabari xatosi", err);
        }
    }

    await ctx.reply("✅ Chek yuborildi. Admin tasdiqlashni kuting.");
}
