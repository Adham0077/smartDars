import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";

const repo = AppDataSource.getRepository(User);

export const UserService = {
    async findOrCreate(ctx) {
        let user = await repo.findOne({ where: { userId: ctx.from.id } });

        if (!user) {
            user = repo.create({
                userId: ctx.from.id,
                username: ctx.from.username || null,
                firstName: ctx.from.first_name,
                lastName: ctx.from.last_name,
            });
            await repo.save(user);
        }
        return user;
    },

    async setLanguage(userId, lang) {
        await repo.update({ userId }, { language: lang });
    },

    async updateSubscription(userId, status) {
        await repo.update({ userId }, { isSubscribed: status });
    },

    async get(userId) {
        return repo.findOne({ where: { userId } });
    }
};
