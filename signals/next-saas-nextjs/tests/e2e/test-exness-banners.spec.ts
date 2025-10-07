import { test, expect } from '@playwright/test';

test.describe('Exness Banners - Sticky Behavior Test', () => {
  const BASE_URL = 'http://localhost:5001/en';

  test('Desktop viewport (1920x1080) - Side banner sticky behavior', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto(BASE_URL);

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: 'desktop-banner-initial.png',
      fullPage: false
    });
    console.log('✓ Desktop initial screenshot taken');

    // Wait for potential rotation
    await page.waitForTimeout(3000);

    // Take screenshot after rotation wait
    await page.screenshot({
      path: 'desktop-banner-after-rotation.png',
      fullPage: false
    });
    console.log('✓ Desktop after rotation screenshot taken');

    // Scroll down the page
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);

    // Take screenshot after scroll to verify sticky behavior
    await page.screenshot({
      path: 'desktop-banner-after-scroll.png',
      fullPage: false
    });
    console.log('✓ Desktop after scroll screenshot taken (verify sticky)');

    // Scroll more to check footer banner
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'desktop-footer-banner.png',
      fullPage: false
    });
    console.log('✓ Desktop footer banner screenshot taken');
  });

  test('Mobile viewport (375x667) - Banner visibility and sizing', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(BASE_URL);

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: 'mobile-banner-initial.png',
      fullPage: false
    });
    console.log('✓ Mobile initial screenshot taken');

    // Wait for potential rotation
    await page.waitForTimeout(3000);

    // Take screenshot after rotation wait
    await page.screenshot({
      path: 'mobile-banner-after-rotation.png',
      fullPage: false
    });
    console.log('✓ Mobile after rotation screenshot taken');

    // Scroll down the page
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1000);

    // Take screenshot after scroll to verify sticky behavior
    await page.screenshot({
      path: 'mobile-banner-after-scroll.png',
      fullPage: false
    });
    console.log('✓ Mobile after scroll screenshot taken (verify sticky)');

    // Scroll to footer
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'mobile-footer-banner.png',
      fullPage: false
    });
    console.log('✓ Mobile footer banner screenshot taken');
  });

  test('Tablet viewport (768x1024) - Additional test', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto(BASE_URL);

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: 'tablet-banner-initial.png',
      fullPage: false
    });
    console.log('✓ Tablet initial screenshot taken');

    // Wait for rotation
    await page.waitForTimeout(5000);

    // Take screenshot after rotation
    await page.screenshot({
      path: 'tablet-banner-after-rotation.png',
      fullPage: false
    });
    console.log('✓ Tablet after rotation screenshot taken');

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'tablet-banner-after-scroll.png',
      fullPage: false
    });
    console.log('✓ Tablet after scroll screenshot taken (verify sticky)');
  });

  test('Banner rotation verification - Extended wait', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Take screenshots at intervals to verify rotation
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'rotation-test-0s.png', fullPage: false });
    console.log('✓ Rotation test 0s screenshot taken');

    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'rotation-test-6s.png', fullPage: false });
    console.log('✓ Rotation test 6s screenshot taken');

    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'rotation-test-12s.png', fullPage: false });
    console.log('✓ Rotation test 12s screenshot taken');
  });
});
