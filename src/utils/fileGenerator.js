import PptxGenJS from "pptxgenjs";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config/envData.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generatePresentationFile({ slidesContent = [], title = "presentation" }) {
    const pptx = new PptxGenJS();
    slidesContent.forEach((text, idx) => {
        const slide = pptx.addSlide();
        slide.addText(text, { x: 0.5, y: 0.5, w: "90%", h: "80%", fontSize: 20 });
    });

    const filename = `${uuidv4()}_${title.replace(/\s+/g, "_")}.pptx`;
    const folder = ENV.FILE_STORAGE_PATH;
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    const filepath = join(folder, filename);

    await pptx.writeFile({ fileName: filepath });
    return filepath;
}
