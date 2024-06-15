import { expect, test } from 'vitest';
import { scrapeNews } from './scrape-news';

test('scrapeNews', async () => {
    let data: any = null;
    const ctx = {
        env: {},
        json: (d: any) => {
            data = d;
        },
    };
    await scrapeNews(ctx as any);
    expect(data).toBeInstanceOf(Array);
}, 30000);
