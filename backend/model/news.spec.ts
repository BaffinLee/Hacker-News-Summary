import { expect, test } from 'vitest';
import { NewsModel } from './news';

const newsModel = new NewsModel();
const TEST_ID = 123;

test('newsModel', async () => {
    try {
        // @ts-ignore
        await newsModel.model.news.delete({ where: { id: TEST_ID } });
    } catch (err) {}

    const oldCount = await newsModel.getNewsCount();
    await newsModel.saveNewsList([
        {
            id: TEST_ID,
            title: 'test title 1',
            user: 'test_user_1',
            url: 'https://example.com',
        },
    ]);
    const newCount = await newsModel.getNewsCount();
    expect(newCount).toBe(oldCount);

    const ids = await newsModel.filterNewsIds([TEST_ID]);
    expect(ids.length).toBe(0);

    const needSummarizeList = await newsModel.getNeedSummarizeList();
    expect(needSummarizeList.find(item => item.id === TEST_ID)).toBeTruthy();

    await newsModel.saveNewsSummary(TEST_ID, 'test summary');

    const list = await newsModel.getNewsList();
    expect(list.find(item => item.id === TEST_ID)?.summary).toBeTruthy();
});
