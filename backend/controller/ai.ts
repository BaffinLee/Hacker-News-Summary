import { MinimumContext } from "../types";
import { HTTPException } from 'hono/http-exception';
import { Ai } from "@cloudflare/workers-types";

const AI_MODEL = '@cf/meta/llama-3.2-1b-instruct';

export async function aiSummarize(ctx?: MinimumContext) {
    if (!ctx?.env.AI) {
        throw new HTTPException(400, { message: 'ai function can only run on cloudflare worker' });
    }
    const body = await ctx.req.parseBody();
    const content = body['content'];
    if (!content || typeof content !== 'string') {
        throw new HTTPException(400, { message: 'need content string' });
    }
    const response = await getAiSummarize(content, ctx.env.AI);
    return ctx.json(response);
}

export function getAiSummarize(content: string, AI?: Ai): Promise<{ summary: string }> {
    if (AI) {
        return AI.run(AI_MODEL, {
            prompt: `Please summarize following content and output pure summary without extra description:\n${content}`
        }).then(res => res.json()).then(res => ({ ...res, summary: res.response || '' }));
    }
    return fetch('https://hacker-news-backend.baffinlee.workers.dev/ai-summarize', {
        method: 'POST',
        body: (new URLSearchParams({ content })).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(res => res.json());
}
