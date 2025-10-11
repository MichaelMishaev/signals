import { test, expect } from '@playwright/test';

test('final test - signals are clickable and navigate to drills', async ({ page }) => {
  console.log('\n=== FINAL TEST: Homepage to Drills ===\n');

  // Navigate to homepage
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Take screenshot of homepage
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/homepage-final.png', fullPage: true });

  // Count signal cards
  const signalCards = await page.locator('[data-signal-card]').count();
  console.log(`✅ Signal cards found: ${signalCards}`);
  expect(signalCards).toBeGreaterThan(0);

  // Find and click the first signal button
  const firstButton = page.locator('[data-signal-card]').first().locator('button');
  const buttonText = await firstButton.textContent();
  console.log(`✅ Button text: ${buttonText}`);

  console.log('\n🖱️  Clicking signal button...');
  await firstButton.click();

  // Wait for navigation
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Check URL
  const currentUrl = page.url();
  console.log(`✅ Navigated to: ${currentUrl}`);
  expect(currentUrl).toContain('/signal/');

  // Take screenshot of drill page
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/drill-page-final.png', fullPage: true });

  // Check for drill tabs
  const caseStudy = await page.locator('text=CASE STUDY').count();
  const analytics = await page.locator('text=ANALYTICS').count();
  const blog = await page.locator('text=BLOG').count();

  console.log(`\n📚 Drill tabs:`);
  console.log(`  - CASE STUDY: ${caseStudy > 0 ? '✅' : '❌'}`);
  console.log(`  - ANALYTICS: ${analytics > 0 ? '✅' : '❌'}`);
  console.log(`  - BLOG: ${blog > 0 ? '✅' : '❌'}`);

  expect(caseStudy).toBeGreaterThan(0);
  expect(analytics).toBeGreaterThan(0);
  expect(blog).toBeGreaterThan(0);

  console.log('\n🎉 SUCCESS! Drills are fully functional!\n');
});
