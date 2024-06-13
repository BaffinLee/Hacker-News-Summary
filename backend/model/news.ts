import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { D1Database } from '@cloudflare/workers-types';
import { NewsInfo } from '../types';

export class NewsModel {
    private model: PrismaClient;

    constructor(db?: D1Database) {
        if (db) {
            this.model = new PrismaClient({
                adapter: new PrismaD1(db),
            });
        } else {
            this.model = new PrismaClient();
        }
    }

    getNewsList(skip = 0, take = 10) {
        return this.model.news.findMany({
            orderBy: [{
                createdAt: 'desc',
            }],
            skip,
            take,
        });
    }

    getNewsCount() {
        return this.model.news.count();
    }

    async filterNewsIds(ids: number[]) {
        const newsList = await this.model.news.findMany({
            where: { id: { in: ids }},
            select: { id: true },
        });
        const existIdMap = newsList.reduce((map, item) => {
            map[item.id] = true;
            return map;
        }, {} as { [id: number]: boolean });
        return ids.filter(id => !existIdMap[id]);
    }

    saveNewsList(newsList: NewsInfo[]) {
        return this.model.news.createMany({ data: newsList });
    }

    saveNewsSummary(id: number, summary: string) {
        return this.model.news.update({
            where: { id },
            data: { summary },
        });
    }

    getNeedSummarizeList(take = 3) {
        return this.model.news.findMany({
            orderBy: [{
                createdAt: 'desc',
            }],
            where: {
                summary: null,
            },
            take,
        });
    }
}
