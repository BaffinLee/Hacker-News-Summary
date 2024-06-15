import { expect, test } from 'vitest';
import puppeteer from 'puppeteer';

test('webpage', async () => {
    await fetch('http://127.0.0.1:8080').catch(() => {
        console.log('please start backend service first!');
        process.exit();
    });
    await fetch('http://127.0.0.1:8081').catch(() => {
        console.log('please start frontend service first!');
        process.exit();
    });

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.PUPPETEER_EXEC_PATH,
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:8081');
    const list = await page.waitForSelector('.news-list');
    const itemCount = await list?.evaluate(el => el.querySelectorAll('li').length);
    expect(itemCount).toBeGreaterThan(0);
}, 60 * 1000 * 3);
