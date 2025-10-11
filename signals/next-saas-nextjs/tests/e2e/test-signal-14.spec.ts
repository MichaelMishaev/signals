import { test, expect } from '@playwright/test';

test('test signal page 14 loads', async ({ page }) => {
  console.log('Navigating to http://localhost:5001/en/signal/14');
  await page.goto('http://localhost:5001/en/signal/14', { waitUntil: 'networkidle' });

  // Take a screenshot
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/signal-14-loaded.png', fullPage: true });

  // Check page loaded
  const pageText = await page.textContent('body');
  console.log('Page contains 404:', pageText?.includes('404'));
  console.log('Page contains EUR/USD:', pageText?.includes('EUR/USD'));

  // Check for signal title
  const title = await page.locator('h1').textContent();
  console.log('Page title:', title);

  expect(title).toContain('EUR/USD');
});
