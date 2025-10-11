import { test } from '@playwright/test';

test('debug sidebar visibility', async ({ page }) => {
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Check if SignalsFeed component exists
  const signalsFeed = await page.locator('.p-6.bg-white.dark\\:bg-background-6').first();
  const feedVisible = await signalsFeed.isVisible();
  console.log('SignalsFeed container visible:', feedVisible);

  // Get bounding box
  const box = await signalsFeed.boundingBox();
  console.log('SignalsFeed bounding box:', box);

  // Check if signal cards exist
  const cards = await page.locator('[data-signal-card]');
  const count = await cards.count();
  console.log('Signal cards count:', count);

  // Check each card's visibility
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const visible = await card.isVisible();
    const cardBox = await card.boundingBox();
    const text = await card.locator('h4').textContent();
    console.log(`Card ${i} (${text}):`, { visible, box: cardBox });
  }

  // Check if sidebar column exists
  const sidebar = await page.locator('.lg\\:col-span-1').count();
  console.log('Sidebar columns found:', sidebar);

  // Scroll to sidebar area
  await page.evaluate(() => {
    const sidebar = document.querySelector('.lg\\:col-span-1');
    sidebar?.scrollIntoView({ behavior: 'instant' });
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/sidebar-debug.png', fullPage: true });

  // Try to get the actual HTML of the signals feed
  const html = await page.locator('[data-signal-card]').first().innerHTML();
  console.log('\nFirst card HTML:', html.substring(0, 200));
});
