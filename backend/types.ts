import { Ai, D1Database } from "@cloudflare/workers-types";
import { Context, HonoRequest } from "hono";

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

export interface OptionalContext {
    env: Partial<Env>;
    json?: Context['json'];
}

export interface MinimumContext {
    env: Partial<Env>;
    json: Context['json'];
    req: {
        parseBody: HonoRequest['parseBody'];
        query: HonoRequest['query'];
    };
}
