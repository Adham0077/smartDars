import { aiSolveTest } from "../../utils/aiClient.js";
import { getPrices } from "../../utils/price.js";

export async function solveTest(user, userRepository, testText) {
    const prices = getPrices();

    if (user.balance < prices.test) {
        throw new Error("Balans yetarli emas");
    }

    const result = await aiSolveTest(testText);

    user.balance -= prices.test;
    await userRepository.save(user);

    return result;
}
