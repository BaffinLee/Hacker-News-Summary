import { Context } from "hono";
import { NewsModel } from "../model/news";
import { Env, NewsInfo } from "../types";

const FETCH_LIST_SIZE = 30;
const FETCH_DETAIL_SIZE = 10;

export async function scrapNews(ctx?: Context<{ Bindings: Partial<Env> }>) {
    const newsModel = new NewsModel(ctx?.env.DB);
    const newsIds: number[] = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty').then(res => res.json());
    const newsIdsToSave = await newsModel.filterNewsIds(newsIds.slice(0, FETCH_LIST_SIZE));
    const newsList: NewsInfo[] = [];
    for (let id of newsIdsToSave.slice(0, FETCH_DETAIL_SIZE)) {
        const news = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then(res => res.json());
        if (news.type !== 'story') continue;
        newsList.push({
            id: news.id,
            user: news.by,
            title: news.title,
            url: news.url,
        });
        console.log(`fetched news: ${news.title} by @${news.by}`);
    }
    if (newsList.length > 0) {
        await newsModel.saveNewsList(newsList);
    }
    return ctx?.json?.(newsList);
}
