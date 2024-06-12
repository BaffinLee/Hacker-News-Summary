import { ScheduledEvent } from "@cloudflare/workers-types";
import { getNewsList } from "../controller/home";
import { scrapeNews } from "../controller/scrape-news";
import { Env } from "../types";
import { aiSummarize } from "../controller/ai";
import { summarizeNews } from "../controller/summarize-news";

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

export async function handleCron(event: ScheduledEvent, env: Env) {
    switch (event.cron) {
        case '*/10 * * * *':
            await scrapeNews({ env });
            break;
        case '*/3 * * * *':
            await summarizeNews({ env });
            break;
    }
}
