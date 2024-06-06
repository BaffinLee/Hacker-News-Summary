import { Hono } from 'hono';
import { serve } from '@hono/node-server'

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
  return c.json({
    message: 'Hello World!',
  });
});

serve({
  fetch: app.fetch,
  port: 8080,
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
