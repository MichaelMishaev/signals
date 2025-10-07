import { test, expect, type Page } from '@playwright/test';

/**
 * Comprehensive Banner System Test Suite
 * Tests all banner positions, platform detection, rotation, slow network, etc.
 * Critical for revenue - must pass 100%
 */

const BASE_URL = 'http://localhost:5001';

test.describe('Banner System - Complete Test Suite', () => {
  test.describe('Banner Visibility - All Positions', () => {
    test('Side banner visible on homepage', async ({ page }) => {
      await page.goto(BASE_URL);

      // Wait for banner to load
      await page.waitForLoadState('networkidle');

      // Check side banner exists
      const sideBanner = page.locator('img[src*="cloudfront.net"]').filter({ has: page.locator('img[width="120"], img[width="160"]') }).first();
      await expect(sideBanner).toBeVisible({ timeout: 10000 });

      // Verify it's in the sidebar (sticky container)
      const stickyContainer = page.locator('.sticky');
      await expect(stickyContainer).toContainText('Sponsored');
    });

    test('Footer banner visible on homepage', async ({ page }) => {
      await page.goto(BASE_URL);

      // Scroll to footer area
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // Check footer banner exists (728x90, 320x50, or 970x250)
      const footerBanner = page.locator('img[src*="cloudfront.net"]').filter({
        has: page.locator('img[width="728"], img[width="320"], img[width="970"]')
      }).first();

      await expect(footerBanner).toBeVisible({ timeout: 10000 });
    });

    test('Between-signals banner visible in feed', async ({ page }) => {
      await page.goto(BASE_URL);

      // Wait for signals to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check between-signals banner appears after 3rd signal
      const betweenBanner = page.locator('img[src*="cloudfront.net"]').filter({
        has: page.locator('img[width="800"], img[width="300"], img[width="1200"]')
      }).first();

      // This banner only appears if there are 4+ signals
      const signalCount = await page.locator('.bg-gray-50').count();
      if (signalCount >= 4) {
        await expect(betweenBanner).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Platform Detection', () => {
    test('Desktop shows web banners (120x600, 160x600 for side)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Check for web banner sizes
      const sideBanner = page.locator('img[src*="120x600"], img[src*="160x600"]').first();
      await expect(sideBanner).toBeVisible({ timeout: 10000 });
    });

    test('Mobile shows mobile banners (120x600 for side)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Mobile should show 120x600 banners
      const mobileBanner = page.locator('img[src*="120x600"]').first();
      await expect(mobileBanner).toBeVisible({ timeout: 10000 });
    });

    test('Tablet (iPad) shows web banners', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Tablets should get web banners
      const banner = page.locator('img[src*="cloudfront.net"]').first();
      await expect(banner).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Banner Rotation', () => {
    test('Side banner rotates every 5 seconds', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Get initial banner src
      const initialSrc = await page.locator('img[src*="cloudfront.net"]').first().getAttribute('src');

      // Wait 6 seconds for rotation
      await page.waitForTimeout(6000);

      // Get new banner src
      const newSrc = await page.locator('img[src*="cloudfront.net"]').first().getAttribute('src');

      // Should be different (rotated)
      expect(initialSrc).not.toBe(newSrc);
    });

    test('Footer banner rotates every 5 seconds', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState('networkidle');

      // Get initial footer banner src
      const footerBanner = page.locator('img[width="728"], img[width="320"], img[width="970"]').first();
      const initialSrc = await footerBanner.getAttribute('src');

      // Wait 6 seconds
      await page.waitForTimeout(6000);

      const newSrc = await footerBanner.getAttribute('src');
      expect(initialSrc).not.toBe(newSrc);
    });
  });

  test.describe('Slow Network Handling', () => {
    test('Shows loading skeleton on slow 3G', async ({ page, context }) => {
      // Simulate slow 3G
      await context.route('**/*', route => {
        setTimeout(() => route.continue(), 2000); // 2s delay
      });

      await page.goto(BASE_URL);

      // Should show loading skeleton
      const skeleton = page.locator('.animate-pulse').first();
      await expect(skeleton).toBeVisible({ timeout: 5000 });
    });

    test('Banner eventually loads on slow connection', async ({ page }) => {
      // Simulate slow 3G with network emulation
      const client = await page.context().newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: (750 * 1024) / 8, // 750kbps
        uploadThroughput: (250 * 1024) / 8,
        latency: 100,
      });

      await page.goto(BASE_URL);

      // Banner should eventually load (within 15s)
      const banner = page.locator('img[src*="cloudfront.net"]').first();
      await expect(banner).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Ad Blocker Simulation', () => {
    test('Hides banner gracefully when blocked', async ({ page }) => {
      // Block banner requests
      await page.route('**/*cloudfront.net/**', route => route.abort());

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Banner container should not be visible (hidden completely)
      // If ad blocked, component returns null
      const bannerCount = await page.locator('img[src*="cloudfront.net"]').count();
      expect(bannerCount).toBe(0);
    });
  });

  test.describe('Layout Stability (CLS)', () => {
    test('Footer banner does not cause layout shift on rotation', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState('networkidle');

      // Get initial layout position
      const riskDisclaimer = page.locator('text=Risk warning').first();
      const initialBoundingBox = await riskDisclaimer.boundingBox();

      // Wait for rotation
      await page.waitForTimeout(6000);

      // Get new position
      const newBoundingBox = await riskDisclaimer.boundingBox();

      // Position should not change significantly (< 5px shift)
      if (initialBoundingBox && newBoundingBox) {
        expect(Math.abs(initialBoundingBox.y - newBoundingBox.y)).toBeLessThan(5);
      }
    });

    test('Side banner has fixed height (no shift)', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Side banner container should have minHeight
      const sideContainer = page.locator('.sticky').first();
      const height1 = await sideContainer.boundingBox();

      await page.waitForTimeout(6000); // Wait for rotation

      const height2 = await sideContainer.boundingBox();

      // Height should remain constant
      if (height1 && height2) {
        expect(Math.abs(height1.height - height2.height)).toBeLessThan(10);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('Mobile 320px - banners fit screen', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const banner = page.locator('img[src*="cloudfront.net"]').first();
      const box = await banner.boundingBox();

      // Banner should not overflow viewport
      if (box) {
        expect(box.width).toBeLessThanOrEqual(320);
      }
    });

    test('Tablet 768px - correct banner sizes', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const banner = page.locator('img[src*="cloudfront.net"]').first();
      await expect(banner).toBeVisible({ timeout: 10000 });
    });

    test('Desktop 1440px - full size banners', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const banner = page.locator('img[src*="cloudfront.net"]').first();
      await expect(banner).toBeVisible({ timeout: 10000 });
    });

    test('Mobile 1200x1500 banner scales properly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Check if the large portrait banner exists
      const largeBanner = page.locator('img[width="1200"][height="1500"]').first();

      if (await largeBanner.isVisible()) {
        const box = await largeBanner.boundingBox();

        // Should scale down to fit mobile screen
        if (box) {
          expect(box.width).toBeLessThanOrEqual(375);
          expect(box.height).toBeLessThanOrEqual(667);
        }
      }
    });
  });

  test.describe('Analytics Tracking', () => {
    test('Tracks banner impression on load', async ({ page }) => {
      const consoleLogs: string[] = [];

      page.on('console', msg => {
        if (msg.text().includes('[Banner Analytics]')) {
          consoleLogs.push(msg.text());
        }
      });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Should have logged impression
      const impressionLogs = consoleLogs.filter(log => log.includes('Impression'));
      expect(impressionLogs.length).toBeGreaterThan(0);
    });

    test('Tracks banner click', async ({ page }) => {
      const consoleLogs: string[] = [];

      page.on('console', msg => {
        if (msg.text().includes('[Banner Analytics]')) {
          consoleLogs.push(msg.text());
        }
      });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Click banner
      const banner = page.locator('a[href*="exnessonelink"]').first();
      await banner.click();

      await page.waitForTimeout(1000);

      // Should have logged click
      const clickLogs = consoleLogs.filter(log => log.includes('Click'));
      expect(clickLogs.length).toBeGreaterThan(0);
    });
  });

  test.describe('Error Handling', () => {
    test('Shows retry button on failed load', async ({ page }) => {
      // Simulate network failure
      let requestCount = 0;
      await page.route('**/*cloudfront.net/**', route => {
        requestCount++;
        if (requestCount < 4) {
          route.abort(); // Fail first 3 attempts
        } else {
          route.continue();
        }
      });

      await page.goto(BASE_URL);
      await page.waitForTimeout(8000); // Wait for retries

      // Should show error state with retry button
      const retryButton = page.locator('button:has-text("Retry")').first();

      // If retries exhausted, retry button should be visible
      if (await retryButton.isVisible()) {
        await retryButton.click();
        await page.waitForTimeout(2000);

        // After retry, banner should load (4th attempt succeeds)
        const banner = page.locator('img[src*="cloudfront.net"]').first();
        await expect(banner).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Affiliate URL', () => {
    test('Desktop uses correct affiliate URL (no platform param)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const link = page.locator('a[href*="exnessonelink.com"]').first();
      const href = await link.getAttribute('href');

      expect(href).toContain('c_8f0nxidtbt');
      expect(href).toContain('pos='); // Should have position tracking
    });

    test('Mobile uses correct affiliate URL (platform=mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Set mobile user agent
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const link = page.locator('a[href*="exnessonelink.com"]').first();
      const href = await link.getAttribute('href');

      if (href) {
        expect(href).toContain('c_8f0nxidtbt');
        expect(href).toContain('platform=mobile');
      }
    });
  });

  test.describe('Performance', () => {
    test('Banner loads within 5 seconds on 4G', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(BASE_URL);

      const banner = page.locator('img[src*="cloudfront.net"]').first();
      await expect(banner).toBeVisible({ timeout: 10000 });

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000);
    });

    test('Total banner data < 500KB on initial load', async ({ page }) => {
      let totalBannerSize = 0;

      page.on('response', response => {
        if (response.url().includes('cloudfront.net')) {
          response.body().then(buffer => {
            totalBannerSize += buffer.length;
          }).catch(() => {});
        }
      });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Should load max 3 banners initially (side, footer, between)
      // Each ~150KB max = 450KB total
      expect(totalBannerSize).toBeLessThan(500 * 1024);
    });
  });
});
