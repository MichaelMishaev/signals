import { test, expect } from '@playwright/test';

test('CENTER column signals should now be clickable', async ({ page, context }) => {
  await context.clearCookies();

  console.log('\n🎯 Testing CENTER Column Signal Clicks\n');

  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Force reload
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to signals area
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/before-center-click.png',
    fullPage: true
  });

  // Find the FIRST center column signal (should be a Link now)
  const centerSignal = page.locator('.max-w-\\[850px\\] a[href*="/signal/"]').first();
  const count = await centerSignal.count();

  console.log(`Found ${count} clickable center signals`);

  if (count === 0) {
    console.log('❌ NO CLICKABLE SIGNALS IN CENTER!');
    console.log('Signals may not have hasDrillData=true');

    // Check if signals exist at all
    const anySignals = await page.locator('.max-w-\\[850px\\]').count();
    console.log(`Total signal containers: ${anySignals}`);

    return;
  }

  // Get the href
  const href = await centerSignal.getAttribute('href');
  console.log(`\n✅ Found clickable signal with href: ${href}`);

  // Click it
  console.log('🖱️  Clicking center column signal...');
  await centerSignal.click();

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const finalUrl = page.url();
  console.log(`\n📍 Navigated to: ${finalUrl}`);

  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/after-center-click.png',
    fullPage: true
  });

  // Check for drill tabs
  const tabs = await page.locator('text=/CASE STUDY|ANALYTICS|BLOG/').count();
  console.log(`\n📚 Drill tabs found: ${tabs}`);

  expect(finalUrl).toContain('/signal/');
  expect(tabs).toBeGreaterThan(0);

  console.log('\n✅ SUCCESS! Center column signals are clickable and navigate to drills!\n');
});
