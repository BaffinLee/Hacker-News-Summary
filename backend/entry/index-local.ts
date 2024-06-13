import fetch from 'node-fetch';
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { ROUTES, handleCron } from './routes';
import { cors } from 'hono/cors'

if (!globalThis.fetch) {
  (globalThis as any).fetch = fetch;
}

const app = new Hono();

app.use(cors({
  maxAge: 60 * 60 * 24,
  origin: (_, ctx) => (new URL(ctx.req.url)).origin,
  credentials: true,
}));

ROUTES.forEach(route => {
  app.on(route.method, route.path, route.handler);
});

const ONE_MINUTE = 1000 * 60;
setInterval(() => {
  const minute = Math.floor(Date.now() / ONE_MINUTE);
  if (minute % 2 === 0) {
    handleCron({ cron: '*/3 * * * *' }, {});
  } else if (minute % 5 === 0) {
    handleCron({ cron: '*/10 * * * *' }, {});
  }
}, ONE_MINUTE);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 8080),
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
