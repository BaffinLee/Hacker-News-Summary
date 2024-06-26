import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { ROUTES, SCRAPE_NEWS_CRON, SUMMARIZE_NEWS_CRON, handleCron } from './routes';
import { cors } from 'hono/cors';
import fs from 'fs';
import path from 'path';
import { Env } from '../types';

if (!fs.existsSync(path.resolve(__dirname, '../prisma/dev.db'))) {
  console.error('Please run migration command first! Check README.md for instructions.');
  process.exit(1);
}

const app = new Hono<{ Bindings: Env }>();

app.use(cors({
  maxAge: 60 * 60 * 24,
  origin: '*',
}));

ROUTES.forEach(route => {
  app.on(route.method, route.path, route.handler);
});

const ONE_MINUTE = 1000 * 60;
setInterval(() => {
  const minute = Math.floor(Date.now() / ONE_MINUTE);
  if (minute % 2 === 0) {
    handleCron({ cron: SUMMARIZE_NEWS_CRON }, {});
  } else if (minute % 5 === 0) {
    handleCron({ cron: SCRAPE_NEWS_CRON }, {});
  }
}, ONE_MINUTE);

serve({
  fetch: app.fetch,
  hostname: '127.0.0.1',
  port: Number(process.env.PORT || 8080),
}, (info) => {
  console.log(`Listening on http://127.0.0.1:${info.port}`);
  handleCron({ cron: SCRAPE_NEWS_CRON }, {})
    .then(() => handleCron({ cron: SUMMARIZE_NEWS_CRON }, {}));
});
