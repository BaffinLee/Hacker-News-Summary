import { Context } from "hono";
import { D1Database } from '@cloudflare/workers-types';
import { NewsModel } from "../model/news";

export async function getNewsList(ctx: Context<{ Bindings: { DB?: D1Database } }>) {
    const newsModel = new NewsModel(ctx.env.DB);
    const news = await newsModel.getNews();
    return ctx.json(news);
}
