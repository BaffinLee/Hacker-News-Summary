import { NewsModel } from "../model/news";
import { OptionalContext } from "../types";
import { load } from 'cheerio';
import { getAiSummarize } from "./ai";

const BATCH_SIZE = 3;
const MAX_CONTENT_LENGTH = 10000;

export async function summarizeNews(ctx?: OptionalContext) {
    const newsModel = new NewsModel(ctx?.env.DB);
    const newsList = await newsModel.getNeedSummarizeList(BATCH_SIZE);
    for (let news of newsList) {
        try {
            await newsModel.saveNewsSummary(news.id, '');
            const res = await fetch(news.url, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                    "cache-control": "max-age=0",
                    "priority": "u=0, i",
                    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-site",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "Referer": news.url,
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                },
                "body": null,
                "method": "GET"
            });
            if (!res || res.status >= 300 || res.status < 200) {
                throw new Error('status not 200');
            }
            const html = await res.text();
            const $ = load(html);
            [
                'script', 'style', 'link', 'img', 'video', 'iframe',
                'noscript', 'audio', 'nav', 'footer', 'header', 'figure',
                'form', 'embed', 'input', 'select', 'picture', 'search',
                'template',
            ].forEach(tag => {
                $(tag).remove();
            });
            const title = $('title').text();
            if (title.includes('Just a moment')) {
                throw new Error('cloudflare waiting page');
            }
            const body = $('body').text();
            const content = `${title}\n${body}`.replace(/\s*\n\s*/g, '\n').slice(0, MAX_CONTENT_LENGTH);
            const data = await getAiSummarize(content, ctx?.env.AI);
            if (data.summary.includes(title) && data.summary.length - title.length < 10) {
                throw new Error('summary similar to title');
            }
            await newsModel.saveNewsSummary(news.id, data.summary);
            news.summary = data.summary;
            console.log(`summarized news: ${news.title}`);
        } catch (err) {
            console.error(err);
        }
    }
    return ctx?.json?.(newsList);
}
