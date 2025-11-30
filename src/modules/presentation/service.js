import { aiGeneratePresentation } from "../../utils/aiClient.js";
import { generatePresentationFile } from "../../utils/fileGenerator.js";
import { getPrices } from "../../utils/price.js";

export async function createPresentation(user, userRepository, options) {
    const prices = getPrices();

    const isFree = user.firstPresentationFree;

    if (!isFree && user.balance < prices.presentation) {
        throw new Error("Balans yetarli emas");
    }

    // AI bilan prezentatsiya yaratish
    const aiResult = await aiGeneratePresentation(options);

    const filePath = await generatePresentationFile(aiResult);

    if (!isFree) {
        user.balance -= prices.presentation;
    } else {
        user.firstPresentationFree = false;
    }

    await userRepository.save(user);

    return filePath;
}
