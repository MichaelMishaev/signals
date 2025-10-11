import { test, expect } from '@playwright/test';

test('test homepage signals are now clickable', async ({ page }) => {
  page.on('console', msg => {
    if (msg.text().includes('Error') || msg.text().includes('Failed')) {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  console.log('Navigating to http://localhost:5001/en');
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for signals to load
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/homepage-with-signals.png', fullPage: true });

  // Check for signal cards
  const signalCards = await page.locator('[data-signal-card]').count();
  console.log('Signal cards found:', signalCards);

  // Check for signal links
  const signalLinks = await page.locator('a[href*="/signal/"]').count();
  console.log('Signal links found:', signalLinks);

  expect(signalLinks).toBeGreaterThan(0);

  // Try clicking the first signal
  const firstSignalLink = page.locator('a[href*="/signal/"]').first();
  const href = await firstSignalLink.getAttribute('href');
  console.log('First signal link href:', href);

  await firstSignalLink.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Take screenshot after navigation
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/after-clicking-signal.png', fullPage: true });

  const newUrl = page.url();
  console.log('Navigated to:', newUrl);

  // Check for drill tabs
  const caseStudyTab = await page.locator('text=CASE STUDY').count();
  const analyticsTab = await page.locator('text=ANALYTICS').count();
  const blogTab = await page.locator('text=BLOG').count();

  console.log('\nDrill tabs present:');
  console.log('  - CASE STUDY:', caseStudyTab > 0);
  console.log('  - ANALYTICS:', analyticsTab > 0);
  console.log('  - BLOG:', blogTab > 0);

  expect(caseStudyTab).toBeGreaterThan(0);
  expect(analyticsTab).toBeGreaterThan(0);
  expect(blogTab).toBeGreaterThan(0);

  console.log('\n✅ Successfully navigated from homepage to signal drills!');
});
