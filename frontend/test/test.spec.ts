import { expect, test } from 'vitest';
import puppeteer from 'puppeteer';

test('webpage', async () => {
    await fetch('http://localhost:8080').catch(() => {
        console.log('please start backend service first!');
        process.exit();
    });
    await fetch('http://localhost:8081').catch(() => {
        console.log('please start frontend service first!');
        process.exit();
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8081');
    const list = await page.waitForSelector('.news-list');
    const itemCount = await list?.evaluate(el => el.querySelectorAll('li').length);
    expect(itemCount).toBeGreaterThan(0);
}, 60 * 1000 * 3);
