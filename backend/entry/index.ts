import { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
import { Hono } from 'hono';
import { ROUTES, handleCron } from './routes';
import { Env } from '../types';
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Env }>();

app.use(cors({
  maxAge: 60 * 60 * 24,
  origin: (_, ctx) => (new URL(ctx.req.url)).origin,
  credentials: true,
}));

ROUTES.forEach(route => {
    app.on(route.method, route.path, route.handler);
});

(app as any).scheduled = (event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
  ctx.waitUntil(handleCron(event, env));
};

export default app;
