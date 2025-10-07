import { test, expect } from '@playwright/test';

test('Debug banner visibility', async ({ page }) => {
  await page.goto('http://localhost:5001');

  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Extra time for client-side rendering

  // Take screenshot
  await page.screenshot({ path: 'banner-debug.png', fullPage: true });

  // Log all images
  const images = await page.locator('img').all();
  console.log(`Total images found: ${images.length}`);

  for (const img of images) {
    const src = await img.getAttribute('src');
    const width = await img.getAttribute('width');
    const height = await img.getAttribute('height');
    console.log(`Image: src=${src}, width=${width}, height=${height}`);
  }

  // Check for sponsored text
  const sponsored = page.locator('text=Sponsored');
  const sponsoredCount = await sponsored.count();
  console.log(`Sponsored text found: ${sponsoredCount} times`);

  // Check for banner links
  const exnessLinks = page.locator('a[href*="exness"]');
  const linkCount = await exnessLinks.count();
  console.log(`Exness links found: ${linkCount}`);

  // Check console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.waitForTimeout(2000);

  if (errors.length > 0) {
    console.log('Console errors:', errors);
  }
});
