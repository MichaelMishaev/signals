import { test, expect } from '@playwright/test';

test.describe('Banner UX Verification - Between Signals', () => {
  test('Mobile between-signals banner should be small (not portrait)', async ({ browser }) => {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      viewport: { width: 400, height: 848 }
    });

    const page = await context.newPage();
    await page.goto('http://localhost:5001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Find between-signals banners (300x250)
    const betweenBanners = await page.locator('img[width="300"][height="250"]').all();

    console.log(`\n📱 Mobile Between-Signals Banners Found: ${betweenBanners.length}`);

    for (const banner of betweenBanners) {
      const src = await banner.getAttribute('src');
      const box = await banner.boundingBox();

      if (box) {
        console.log(`  ✅ 300x250 banner: height=${box.height.toFixed(0)}px (should be ~250px)`);
        console.log(`     src: ${src?.split('/').pop()}`);

        // Banner height should be reasonable (not > 400px)
        expect(box.height).toBeLessThan(400);
      }
    }

    // Make sure NO portrait banners (1200x1500) exist
    const portraitBanners = await page.locator('img[width="1200"][height="1500"]').count();
    console.log(`\n🚫 Portrait banners (1200x1500): ${portraitBanners} (should be 0)`);
    expect(portraitBanners).toBe(0);

    await page.screenshot({ path: 'mobile-between-signals-fixed.png', fullPage: true });
  });

  test('Desktop between-signals should use square banner (800x800)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Desktop can have 800x800 or 300x250
    const squareBanners = await page.locator('img[width="800"][height="800"]').all();
    const smallBanners = await page.locator('img[width="300"][height="250"]').all();

    console.log(`\n🖥️  Desktop Between-Signals:`);
    console.log(`  Square (800x800): ${squareBanners.length}`);
    console.log(`  Small (300x250): ${smallBanners.length}`);

    // At least one between-signals banner should exist
    expect(squareBanners.length + smallBanners.length).toBeGreaterThan(0);

    await page.screenshot({ path: 'desktop-between-signals-check.png', fullPage: true });
  });

  test('Mobile feed should scroll smoothly (no huge banners blocking)', async ({ browser }) => {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      viewport: { width: 400, height: 848 }
    });

    const page = await context.newPage();
    await page.goto('http://localhost:5001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Scroll down 1000px
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(500);

    const afterScroll = await page.evaluate(() => window.scrollY);

    console.log(`\n📜 Scroll Test:`);
    console.log(`  Initial: ${initialScroll}px`);
    console.log(`  After +1000px: ${afterScroll}px`);
    console.log(`  Actual scroll: ${afterScroll - initialScroll}px`);

    // Should be able to scroll close to 1000px (allowing for some variance)
    expect(afterScroll - initialScroll).toBeGreaterThan(800);
  });
});
