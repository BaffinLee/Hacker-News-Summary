import { Context } from "hono";
import { Env } from "../types";
import { HTTPException } from 'hono/http-exception';

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
    const response = await ctx.env.AI.run(AI_MODEL, {
        input_text: content,
        max_length: 100
    });
    return ctx.json(response);
}
