import fetch from "node-fetch";
import { ENV } from "../config/envData.js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function askOpenAI(messages, maxTokens = 800) {
    const resp = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini", // or gpt-4o if available; change as needed
            messages,
            max_tokens: maxTokens,
        }),
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`OpenAI error: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    const answer = data.choices?.[0]?.message?.content || "";
    return answer;
}
