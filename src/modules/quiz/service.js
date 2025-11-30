import { aiGenerateQuiz } from "../../utils/aiClient.js";
import { getPrices } from "../../utils/price.js";

export async function createQuiz(user, userRepository, options) {
    const prices = getPrices();
    const isFree = user.firstQuizFree;

    if (!isFree && user.balance < prices.quiz) {
        throw new Error("Balans yetarli emas");
    }

    const quiz = await aiGenerateQuiz(options);

    if (!isFree) {
        user.balance -= prices.quiz;
    } else {
        user.firstQuizFree = false;
    }

    await userRepository.save(user);

    return quiz;
}
