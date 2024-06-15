import { expect, test } from 'vitest';
import { summarizeNews } from './summarize-news';

test('summarizeNews', async () => {
    let data: any = null;
    const ctx = {
        env: {},
        json: (d: any) => {
            data = d;
        },
    };
    await summarizeNews(ctx as any);
    expect(data).toBeInstanceOf(Array);
}, 60000);
