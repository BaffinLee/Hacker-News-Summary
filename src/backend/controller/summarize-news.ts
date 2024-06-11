import { Context } from "hono";
import { NewsModel } from "../model/news";
import { Env, NewsInfo } from "../types";

const BATCH_SIZE = 3;

export async function summarizeNews(ctx?: Context<{ Bindings: Partial<Env> }>) {
    const newsModel = new NewsModel(ctx?.env.DB);
    return ctx?.json?.([]);
}
