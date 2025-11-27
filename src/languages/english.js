import { Markup } from "telegraf";

export function english(bot, ctx, userLanguages) {
    ctx.reply('🇬🇧 You selected English!',
        Markup.keyboard([
            ['Create Presentation', 'Create Quiz'],
            ['Prices', 'Support']
        ]).resize().oneTime()
    );

    // English uchun handlers
    bot.hears('Create Presentation', (ctx) => {
        if (userLanguages[ctx.from.id] === 'en') {
            ctx.reply('📊 Starting presentation creation...');
        }
    });

    bot.hears('Create Quiz', (ctx) => {
        if (userLanguages[ctx.from.id] === 'en') {
            ctx.reply('❓ Creating a quiz...');
        }
    });

    bot.hears('Prices', (ctx) => {
        if (userLanguages[ctx.from.id] === 'en') {
            ctx.reply('💰 Our prices:\n\n✅ Presentation: $10\n✅ Quiz: $6');
        }
    });

    bot.hears('Support', (ctx) => {
        if (userLanguages[ctx.from.id] === 'en') {
            ctx.reply('📞 Contact us: @support_en');
        }
    });
}