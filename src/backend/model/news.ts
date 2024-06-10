import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { D1Database } from '@cloudflare/workers-types';

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

    getNews(skip = 0, take = 10) {
        return this.model.news.findMany({
            orderBy: [{
                createdAt: 'desc',
            }],
            skip,
            take,
        });
    }
}
