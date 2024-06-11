import { ScheduledEvent } from "@cloudflare/workers-types";
import { getNewsList } from "../controller/home";
import { scrapNews } from "../controller/scrap-news";
import { Env } from "../types";
import { aiSummarize } from "../controller/ai";

export const ROUTES = [
    {
        method: 'get',
        path: '/news',
        handler: getNewsList,
    },
    {
        method: 'get',
        path: '/scrap-news',
        handler: scrapNews,
    },
    {
        method: 'post',
        path: '/ai-summarize',
        handler: aiSummarize,
    },
];

export async function handleCron(event: ScheduledEvent, env: Env) {
    switch (event.cron) {
        case '*/10 * * * *':
            // @ts-ignore
            await scrapNews({ env });
            break;
        case '*/3 * * * *':
            break;
    }
}
