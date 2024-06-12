import fetch from 'node-fetch';
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { ROUTES } from './routes';

if (!globalThis.fetch) {
  (globalThis as any).fetch = fetch;
}

const app = new Hono();

ROUTES.forEach(route => {
  app.on(route.method, route.path, route.handler);
});

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 8080),
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
