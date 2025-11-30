import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";

const repo = () => AppDataSource.getRepository(User);
export async function loadUser(ctx, next) {
    try {
        const userId = ctx.from?.id;
        if (!userId) return next();

        // try ctx.session or ctx.state cache first
        if (!ctx.state.user) {
            let user = await repo().findOne({ where: { userId } });
            if (!user) {
                user = repo().create({
                    userId,
                    username: ctx.from.username || null,
                    firstName: ctx.from.first_name || null,
                    lastName: ctx.from.last_name || null,
                });
                await repo().save(user);
            }
            ctx.state.user = user;
        }
        return next();
    } catch (err) {
        console.error("loadUser error", err);
        return next();
    }
}
