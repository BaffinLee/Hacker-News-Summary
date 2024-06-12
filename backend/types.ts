import { Ai, D1Database } from "@cloudflare/workers-types";

export interface NewsInfo {
    id: number;
    title: string;
    user: string;
    url: string;
    summary?: string;
}

export type Env = {
    DB: D1Database;
    AI: Ai;
};
