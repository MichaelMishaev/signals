import { test, expect } from '@playwright/test';

test('verify drills are working on signal page', async ({ page }) => {
  console.log('Navigating to http://localhost:5001/en/signal/14');
  await page.goto('http://localhost:5001/en/signal/14', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for drills to load
  await page.waitForTimeout(2000);

  // Take a screenshot
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/drills-working.png', fullPage: true });

  // Check for drill tabs
  const caseStudyTab = page.locator('text=CASE STUDY');
  const analyticsTab = page.locator('text=ANALYTICS');
  const blogTab = page.locator('text=BLOG');

  const hasCaseStudy = await caseStudyTab.count();
  const hasAnalytics = await analyticsTab.count();
  const hasBlog = await blogTab.count();

  console.log('Has CASE STUDY tab:', hasCaseStudy > 0);
  console.log('Has ANALYTICS tab:', hasAnalytics > 0);
  console.log('Has BLOG tab:', hasBlog > 0);

  expect(hasCaseStudy).toBeGreaterThan(0);
  expect(hasAnalytics).toBeGreaterThan(0);
  expect(hasBlog).toBeGreaterThan(0);

  console.log('✅ All drill tabs are present!');
});
