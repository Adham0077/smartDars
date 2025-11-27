import { Markup, Telegraf } from "telegraf";
import { AppDataSource, initializeDatabase } from "./config/database.js";
import { User } from "./entities/user.js";
import { uzbek } from "./languages/uzbek.js";
import { english } from "./languages/english.js";
import { russian } from "./languages/russian.js";
import { config } from "dotenv";

config();

export const BOT_TOKEN = String(process.env.BOT_TOKEN);
export const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY);

const bot = new Telegraf(BOT_TOKEN);

const userLanguages = {};
const CHANNEL_ID = '@SmartDars_bot_news';
const CHANNEL_URL = 'https://t.me/SmartDars_bot_news';

// Foydalanuvchini database-ga saqlash
async function saveUser(ctx) {
    const userRepository = AppDataSource.getRepository(User);
    
    let user = await userRepository.findOne({
        where: { userId: ctx.from.id }
    });

    if (!user) {
        user = userRepository.create({
            userId: ctx.from.id,
            username: ctx.from.username || 'unknown',
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name,
            language: 'uz',
            isSubscribed: false,
        });
        await userRepository.save(user);
        console.log(`✅ New user saved: ${ctx.from.id}`);
    }
    return user;
}

// Foydalanuvchini obunaga yangilash
async function updateSubscriptionStatus(userId, status) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update({ userId }, { isSubscribed: status });
}

// /start command
bot.start(async (ctx) => {
    await saveUser(ctx);
    
    ctx.reply('Botimizdan foydalanish uchun kanalimizga obuna boʻling 📢\n\nПодпишитесь на наш канал, чтобы использовать бот 📢\n\nSubscribe to our channel to use the bot 📢',
        Markup.inlineKeyboard([
            [
                Markup.button.url('📢 Kanalga obuna boʻlish', CHANNEL_URL),
                Markup.button.callback('✅ Tasdiqlash', 'verify_subscription')
            ]
        ])
    )
});

// Obuna tekshirish
bot.action('verify_subscription', async (ctx) => {
    try {
        const member = await bot.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
        
        if (member.status === 'member' || member.status === 'administrator' || member.status === 'creator') {
            await updateSubscriptionStatus(ctx.from.id, true);
           
            
            ctx.answerCbQuery('✅ Obuna tasdiqland!', true);
            ctx.reply('Tilni tanlang / Select language / Выберите язык',
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(`🇺🇿 O'zbek`, 'select_uz'),
                        Markup.button.callback(`🇬🇧 English`, 'select_en')
                    ],
                    [
                        Markup.button.callback(`🇷🇺 Русский`, 'select_ru')
                    ]
                ])
            )
        } else {
            ctx.answerCbQuery('❌ Avval kanalga obuna boʻling!', true);
        }
    } catch (error) {
        ctx.answerCbQuery('❌ Xato! Avval kanalga obuna boʻling!', true);
    }
});

// Tili tanlanish va database-ga saqlash
bot.action('select_uz', async (ctx) => {
    userLanguages[ctx.from.id] = 'uz';
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update({ userId: ctx.from.id }, { language: 'uz' });
    uzbek(bot, ctx, userLanguages);
    ctx.answerCbQuery();
});

bot.action('select_en', async (ctx) => {
    userLanguages[ctx.from.id] = 'en';
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update({ userId: ctx.from.id }, { language: 'en' });
    english(bot, ctx, userLanguages);
    ctx.answerCbQuery();
});

bot.action('select_ru', async (ctx) => {
    userLanguages[ctx.from.id] = 'ru';
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update({ userId: ctx.from.id }, { language: 'ru' });
    russian(bot, ctx, userLanguages);
    ctx.answerCbQuery();
});

// Bot launch
async function start() {
    await initializeDatabase();
    bot.launch(() => console.log('🤖 Bot started'));
    
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

start().catch(console.error);