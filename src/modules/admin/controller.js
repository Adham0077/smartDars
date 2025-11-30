import { Scenes, Markup } from "telegraf";
import { getUsers, getUsersCount, getPayments, confirmPayment } from "./service.js";
import { adminMenu } from "../../keyboards/adminMenu.js";

export async function adminController(bot) {
    // Admin start
    bot.command("admin", async (ctx) => {
        if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
        ctx.scene.enter("ADMIN_SCENE");
    });
}
