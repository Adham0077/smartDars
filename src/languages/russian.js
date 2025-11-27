import { Markup } from "telegraf";

export function russian(bot, ctx, userLanguages) {
    ctx.reply('🇷🇺 Вы выбрали русский язык!',
        Markup.keyboard([
            ['Создать презентацию', 'Создать тест'],
            ['Цены', 'Поддержка']
        ]).resize().oneTime()
    );

    // Russian uchun handlers
    bot.hears('Создать презентацию', (ctx) => {
        if (userLanguages[ctx.from.id] === 'ru') {
            ctx.reply('📊 Начинаем создание презентации...');
        }
    });

    bot.hears('Создать тест', (ctx) => {
        if (userLanguages[ctx.from.id] === 'ru') {
            ctx.reply('❓ Создаём тест...');
        }
    });

    bot.hears('Цены', (ctx) => {
        if (userLanguages[ctx.from.id] === 'ru') {
            ctx.reply('💰 Наши цены:\n\n✅ Презентация: 50 000 руб.\n✅ Тест: 30 000 руб.');
        }
    });

    bot.hears('Поддержка', (ctx) => {
        if (userLanguages[ctx.from.id] === 'ru') {
            ctx.reply('📞 Свяжитесь с нами: @support_ru');
        }
    });
}