import { expect, test } from 'vitest';
import { getNewsList } from './home';

test('getNewsList', async () => {
    let data: any = null;
    const ctx = {
        env: {},
        req: {
            parseBody() {
                return Promise.resolve({});
            },
            query(key?: string) {
                if (!key) return {} as any;
                return '';
            },
        },
        json: (d: any) => {
            data = d;
        },
    };
    await getNewsList(ctx as any);
    expect(data).toBeTruthy();
    expect(data.count).toBeDefined();
    expect(data.list).toBeInstanceOf(Array);
});
