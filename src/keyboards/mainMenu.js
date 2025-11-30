import { Markup } from "telegraf";

export const mainMenu = Markup.keyboard([
    ["Prezentatsiya yaratish", "Quiz tayyorlash"],
    ["Test javob topish", "Narxlar"],
    ["Xamyon", "Tilni almashtirish"]
]).resize().oneTime();
