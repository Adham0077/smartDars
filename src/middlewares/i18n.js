import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadJson = (name) => JSON.parse(fs.readFileSync(join(__dirname, "../i18n", name), "utf-8"));
const LANGS = {
    uz: loadJson("uz.json"),
    en: loadJson("en.json"),
    ru: loadJson("ru.json"),
};

export function i18nMiddleware(ctx, next) {
    const lang = ctx.state?.user?.language || "uz";
    ctx.i18n = {
        t: (key) => {
            const parts = key.split(".");
            let v = LANGS[lang];
            for (const p of parts) {
                if (!v) return key;
                v = v[p];
            }
            return v || key;
        },
        lang
    };
    return next();
}
