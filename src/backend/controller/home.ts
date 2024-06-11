import { Context } from "hono";
import { NewsModel } from "../model/news";
import { Env } from "../types";

export async function getNewsList(ctx: Context<{ Bindings: Partial<Env> }>) {
    const pageNow = Number(ctx.req.query('pageNow')) || 1;
    const pageSize = Number(ctx.req.query('pageSize')) || 10;
    const newsModel = new NewsModel(ctx.env.DB);
    const news = await newsModel.getNewsList((pageNow - 1) * pageSize, pageSize);
    return ctx.json(news);
}
