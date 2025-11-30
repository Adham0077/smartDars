export async function checkSubscription(bot, channelId, userId) {
    const member = await bot.telegram.getChatMember(channelId, userId);
    return ["member", "administrator", "creator"].includes(member.status);
}
