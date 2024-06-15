import { NewsModel } from "../model/news";
import { MinimumContext } from "../types";

export async function getNewsList(ctx: MinimumContext) {
    const pageNow = Number(ctx.req.query('pageNow')) || 1;
    const pageSize = Number(ctx.req.query('pageSize')) || 10;
    const newsModel = new NewsModel(ctx.env.DB);
    const news = await newsModel.getNewsList((pageNow - 1) * pageSize, pageSize);
    const count = await newsModel.getNewsCount();
    return ctx.json({
        list: news,
        count,
    });
}
