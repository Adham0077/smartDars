import { Markup } from "telegraf";

export function uzbek(bot, ctx, userLanguages) {
    ctx.reply('🇺🇿 O\'zbek tilini tanladingiz!',
        Markup.keyboard([
            ['Prezentatsiya yaratish', 'Quiz test tuzish'],
            ['Narxlar', 'Xamyon']
        ]).resize().oneTime()
    );

    // O'zbek tili uchun handlers
    bot.hears('Prezentatsiya yaratish', (ctx) => {
        if (userLanguages[ctx.from.id] === 'uz') {
            ctx.reply('📊 Prezentatsiya yaratishni boshlaysiz...');
        }
    });

    bot.hears('Quiz test tuzish', (ctx) => {
        if (userLanguages[ctx.from.id] === 'uz') {
            ctx.reply('❓ Quiz test tuzimiz...');
        }
    });

    bot.hears('Narxlar', (ctx) => {
        if (userLanguages[ctx.from.id] === 'uz') {
            ctx.reply('💰 Bizning narxlar:\n\n✅ Prezentatsiya: 50,000 so\'m\n✅ Quiz: 30,000 so\'m');
        }
    });

    bot.hears('Xamyon', (ctx) => {
        if (userLanguages[ctx.from.id] === 'uz') {
            ctx.reply('📞 Biz bilan bog\'laning: @support_uz');
        }
    });
}