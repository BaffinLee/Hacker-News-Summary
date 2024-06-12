import { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
import { Hono } from 'hono';
import { ROUTES, handleCron } from './routes';
import { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

ROUTES.forEach(route => {
    app.on(route.method, route.path, route.handler);
});

(app as any).scheduled = (event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
  ctx.waitUntil(handleCron(event, env));
};

export default app;
