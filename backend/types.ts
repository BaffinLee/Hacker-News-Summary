import { Ai, D1Database } from "@cloudflare/workers-types";
import { Context } from "hono";

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
