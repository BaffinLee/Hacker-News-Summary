import { ScheduledEvent } from "@cloudflare/workers-types";
import { getNewsList } from "../controller/home";
import { scrapeNews } from "../controller/scrape-news";
import { Env } from "../types";
import { aiSummarize } from "../controller/ai";
import { summarizeNews } from "../controller/summarize-news";

export const SCRAPE_NEWS_CRON = '*/10 * * * *';
export const SUMMARIZE_NEWS_CRON = '*/3 * * * *';

export const ROUTES = [
    {
        method: 'get',
        path: '/news',
        handler: getNewsList,
    },
    {
        method: 'get',
        path: '/scrape-news',
        handler: scrapeNews,
    },
    {
        method: 'post',
        path: '/ai-summarize',
        handler: aiSummarize,
    },
    {
        method: 'get',
        path: '/summarize-news',
        handler: summarizeNews,
    },
];

export async function handleCron(event: ScheduledEvent | { cron: string }, env: Partial<Env>) {
    switch (event.cron) {
        case SCRAPE_NEWS_CRON:
            console.log('execute cron: scrape news');
            await scrapeNews({ env });
            break;
        case SUMMARIZE_NEWS_CRON:
            console.log('execute cron: summarize news');
            await summarizeNews({ env });
            break;
    }
}
