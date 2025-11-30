import { Scenes } from "telegraf";
import { presentationScene } from "./presentation.scene.js";
import { quizScene } from "./quiz.scene.js";
import { testScene } from "./test.scene.js";
import { walletScene } from "./wallet.scene.js";

export const stage = new Scenes.Stage([
    presentationScene,
    quizScene,
    testScene,
    walletScene
]);
