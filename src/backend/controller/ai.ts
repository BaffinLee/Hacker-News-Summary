import { Context } from "hono";
import { Env } from "../types";
import { HTTPException } from 'hono/http-exception';
import { Ai } from "@cloudflare/workers-types";

const AI_MODEL = '@cf/facebook/bart-large-cnn';

export async function aiSummarize(ctx?: Context<{ Bindings: Partial<Env> }>) {
    if (!ctx?.env.AI) {
        throw new HTTPException(400, { message: 'ai function can only run on cloudflare worker' });
    }
    const body = await ctx.req.parseBody();
    const content = body['content'];
    if (!content || typeof content !== 'string') {
        throw new HTTPException(400, { message: 'need content string' });
    }
    const response = await aiRun(content, ctx.env.AI);
    return ctx.json(response);
}

export function aiRun(content: string, AI?: Ai) {
    if (AI) {
        return AI.run(AI_MODEL, {
            input_text: content,
            max_length: 100
        });
    }
    return fetch('https://hacker-news-backend.baffinlee.workers.dev/ai-summarize', {
        method: 'POST',
        body: JSON.stringify({
            content: content,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());
}
