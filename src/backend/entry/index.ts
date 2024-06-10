import { D1Database } from '@cloudflare/workers-types';
import { Hono } from 'hono';
import { ROUTES } from './routes';

export type Env = {
  DB: D1Database,
};

const app = new Hono<{ Bindings: Env }>();

ROUTES.forEach(route => {
    app.on(route.method, route.path, route.handler);
});

export default app;
