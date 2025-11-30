import { Scenes, Markup } from "telegraf";
import { getUsers, getPayments, confirmPayment } from "../modules/admin/service.js";
import { adminMenu } from "../keyboards/adminMenu.js";

export const adminScene = new Scenes.BaseScene("ADMIN_SCENE");

adminScene.enter(async (ctx) => {
    ctx.reply("👨‍💻 Admin panelga xush kelibsiz", adminMenu);
});

// Foydalanuvchilar ro‘yxati
adminScene.hears("👤 Foydalanuvchilar", async (ctx) => {
    const users = await getUsers(ctx.state.userRepository);
    let msg = `👤 Foydalanuvchilar soni: ${users.length}\n\n`;
    users.forEach((u) => {
        msg += `ID: ${u.userId} | Username: ${u.username || "unknown"} | Balance: ${u.balance}\n`;
    });
    ctx.reply(msg);
});

// To‘lovlar
adminScene.hears("💳 To‘lovlar", async (ctx) => {
    const payments = await getPayments(ctx.state.paymentRepository);
    if (!payments.length) return ctx.reply("❌ To‘lovlar mavjud emas");
    payments.forEach((p) => {
        ctx.reply(
            `💸 ID: ${p.id}\nUser: ${p.userId}\nSumma: ${p.amount}\nStatus: ${p.status}`,
            Markup.inlineKeyboard([
                Markup.button.callback("✅ Tasdiqlash", `confirm_${p.id}`)
            ])
        );
    });
});

// Tasdiqlash tugmasi
adminScene.action(/confirm_(\d+)/, async (ctx) => {
    const paymentId = parseInt(ctx.match[1]);
    const payment = await ctx.state.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) return ctx.reply("❌ To‘lov topilmadi");

    await confirmPayment(payment, ctx.state.userRepository, ctx.state.paymentRepository);

    ctx.answerCbQuery("✅ To‘lov tasdiqlandi");
    ctx.reply(`To‘lov ${payment.amount} so‘m tasdiqlandi.`);
});

// Statistikalar
adminScene.hears("📊 Statistikalar", async (ctx) => {
    const usersCount = await ctx.state.userRepository.count();
    const paymentsCount = await ctx.state.paymentRepository.count();
    ctx.reply(`📊 Statistika:\nFoydalanuvchilar: ${usersCount}\nTo‘lovlar: ${paymentsCount}`);
});

// Asosiy menyuga qaytish
adminScene.hears("🏠 Asosiy menyu", async (ctx) => {
    ctx.scene.leave();
    ctx.reply("🏠 Asosiy menyu", Markup.keyboard([
        ["Prezentatsiya yaratish", "Quiz tayyorlash"],
        ["Test javob topish", "Narxlar"],
        ["Xamyon", "Tilni almashtirish"]
    ]).resize().oneTime());
});
