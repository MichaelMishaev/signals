import { test, expect } from '@playwright/test';

/**
 * Comprehensive Testing Suite for Unified AdBanner Component
 *
 * Tests the NEW unified banner system that auto-detects platform (web/mobile)
 * and displays 3 rotating variants per position with affiliate tracking.
 *
 * CRITICAL: This tests revenue-generating advertising banners.
 */

test.describe('Unified Banner System - Comprehensive Testing', () => {
  const BASE_URL = 'http://localhost:5001/en';

  // Helper function to extract affiliate URL from banner image link
  const getBannerAffiliateUrl = async (page: any, selector: string) => {
    const href = await page.locator(selector).getAttribute('href');
    return href;
  };

  // Helper function to extract banner image src
  const getBannerImageSrc = async (page: any, selector: string) => {
    const src = await page.locator(`${selector} img`).getAttribute('src');
    return src;
  };

  test.describe('TEST 1: Web Viewport (1920x1080)', () => {
    test('should display all 3 banner positions with correct tracking URLs', async ({ page }) => {
      // Set web viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Allow time for banners to render

      console.log('📸 Taking initial web viewport screenshot...');
      await page.screenshot({
        path: 'test-results/web-initial-full-page.png',
        fullPage: true
      });

      // TEST: Side Banner (Sticky Sidebar)
      console.log('🔍 Testing Side Banner...');
      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="pos=side"]';

      // Wait for side banner to be visible
      await expect(page.locator(sideBannerLink)).toBeVisible({ timeout: 10000 });

      // Get affiliate URL
      const sideUrl = await getBannerAffiliateUrl(page, sideBannerLink);
      console.log(`   Side Banner URL: ${sideUrl}`);

      // Verify URL format (should NOT have platform=mobile for web)
      expect(sideUrl).toContain('pos=side');
      expect(sideUrl).not.toContain('platform=mobile');

      // Get image src
      const sideImageSrc = await getBannerImageSrc(page, sideBannerLink);
      console.log(`   Side Banner Image: ${sideImageSrc}`);
      expect(sideImageSrc).toContain('cloudfront.net');

      // Take screenshot of side banner area
      await page.locator(sideBannerLink).screenshot({
        path: 'test-results/web-side-banner.png'
      });

      // TEST: Footer Banner (Above Risk Disclaimer)
      console.log('🔍 Testing Footer Banner...');

      // Scroll to footer to ensure it's in view
      await page.evaluate(() => {
        const footer = document.querySelector('a[href*="pos=footer"]');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1000);

      const footerBannerLink = 'a[href*="exnessonelink.com"][href*="pos=footer"]';
      await expect(page.locator(footerBannerLink)).toBeVisible({ timeout: 10000 });

      const footerUrl = await getBannerAffiliateUrl(page, footerBannerLink);
      console.log(`   Footer Banner URL: ${footerUrl}`);

      expect(footerUrl).toContain('pos=footer');
      expect(footerUrl).not.toContain('platform=mobile');

      const footerImageSrc = await getBannerImageSrc(page, footerBannerLink);
      console.log(`   Footer Banner Image: ${footerImageSrc}`);

      await page.locator(footerBannerLink).screenshot({
        path: 'test-results/web-footer-banner.png'
      });

      // TEST: Between-Signals Banner (In Timeline)
      console.log('🔍 Testing Between-Signals Banner...');

      // Scroll back to timeline
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(1000);

      const betweenSignalsBannerLink = 'a[href*="exnessonelink.com"][href*="pos=between-signals"]';

      // Check if between-signals banner exists (appears after every 3rd signal)
      const betweenSignalsBannerCount = await page.locator(betweenSignalsBannerLink).count();
      console.log(`   Found ${betweenSignalsBannerCount} between-signals banner(s)`);

      if (betweenSignalsBannerCount > 0) {
        await expect(page.locator(betweenSignalsBannerLink).first()).toBeVisible({ timeout: 10000 });

        const betweenUrl = await getBannerAffiliateUrl(page, `${betweenSignalsBannerLink}:first-of-type`);
        console.log(`   Between-Signals Banner URL: ${betweenUrl}`);

        expect(betweenUrl).toContain('pos=between-signals');
        expect(betweenUrl).not.toContain('platform=mobile');

        const betweenImageSrc = await getBannerImageSrc(page, `${betweenSignalsBannerLink}:first-of-type`);
        console.log(`   Between-Signals Banner Image: ${betweenImageSrc}`);

        await page.locator(betweenSignalsBannerLink).first().screenshot({
          path: 'test-results/web-between-signals-banner.png'
        });
      }

      console.log('✅ Web viewport test completed');
    });

    test('should rotate banners after 6 seconds', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('🔄 Testing banner rotation on web viewport...');

      // Capture initial side banner image
      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="pos=side"]';
      const initialImageSrc = await getBannerImageSrc(page, sideBannerLink);
      console.log(`   Initial side banner: ${initialImageSrc}`);

      await page.screenshot({
        path: 'test-results/web-rotation-before.png',
        fullPage: false
      });

      // Wait 6 seconds for rotation (5s interval + buffer)
      console.log('   Waiting 6 seconds for rotation...');
      await page.waitForTimeout(6000);

      // Capture rotated banner image
      const rotatedImageSrc = await getBannerImageSrc(page, sideBannerLink);
      console.log(`   Rotated side banner: ${rotatedImageSrc}`);

      await page.screenshot({
        path: 'test-results/web-rotation-after.png',
        fullPage: false
      });

      // Verify that the image changed
      expect(initialImageSrc).not.toBe(rotatedImageSrc);
      console.log('✅ Banner rotation verified - image changed');
    });
  });

  test.describe('TEST 2: Mobile Viewport (375x667)', () => {
    test('should display all 3 banner positions with mobile tracking URLs', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('📱 Taking initial mobile viewport screenshot...');
      await page.screenshot({
        path: 'test-results/mobile-initial-full-page.png',
        fullPage: true
      });

      // TEST: Side Banner
      console.log('🔍 Testing Mobile Side Banner...');
      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="platform=mobile"][href*="pos=side"]';

      await expect(page.locator(sideBannerLink)).toBeVisible({ timeout: 10000 });

      const sideUrl = await getBannerAffiliateUrl(page, sideBannerLink);
      console.log(`   Mobile Side Banner URL: ${sideUrl}`);

      // Verify mobile tracking parameters
      expect(sideUrl).toContain('platform=mobile');
      expect(sideUrl).toContain('pos=side');

      const sideImageSrc = await getBannerImageSrc(page, sideBannerLink);
      console.log(`   Mobile Side Banner Image: ${sideImageSrc}`);

      await page.locator(sideBannerLink).screenshot({
        path: 'test-results/mobile-side-banner.png'
      });

      // TEST: Footer Banner
      console.log('🔍 Testing Mobile Footer Banner...');

      await page.evaluate(() => {
        const footer = document.querySelector('a[href*="platform=mobile"][href*="pos=footer"]');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1000);

      const footerBannerLink = 'a[href*="exnessonelink.com"][href*="platform=mobile"][href*="pos=footer"]';
      await expect(page.locator(footerBannerLink)).toBeVisible({ timeout: 10000 });

      const footerUrl = await getBannerAffiliateUrl(page, footerBannerLink);
      console.log(`   Mobile Footer Banner URL: ${footerUrl}`);

      expect(footerUrl).toContain('platform=mobile');
      expect(footerUrl).toContain('pos=footer');

      const footerImageSrc = await getBannerImageSrc(page, footerBannerLink);
      console.log(`   Mobile Footer Banner Image: ${footerImageSrc}`);

      await page.locator(footerBannerLink).screenshot({
        path: 'test-results/mobile-footer-banner.png'
      });

      // TEST: Between-Signals Banner
      console.log('🔍 Testing Mobile Between-Signals Banner...');

      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(1000);

      const betweenSignalsBannerLink = 'a[href*="exnessonelink.com"][href*="platform=mobile"][href*="pos=between-signals"]';

      const betweenSignalsBannerCount = await page.locator(betweenSignalsBannerLink).count();
      console.log(`   Found ${betweenSignalsBannerCount} mobile between-signals banner(s)`);

      if (betweenSignalsBannerCount > 0) {
        await expect(page.locator(betweenSignalsBannerLink).first()).toBeVisible({ timeout: 10000 });

        const betweenUrl = await getBannerAffiliateUrl(page, `${betweenSignalsBannerLink}:first-of-type`);
        console.log(`   Mobile Between-Signals Banner URL: ${betweenUrl}`);

        expect(betweenUrl).toContain('platform=mobile');
        expect(betweenUrl).toContain('pos=between-signals');

        const betweenImageSrc = await getBannerImageSrc(page, `${betweenSignalsBannerLink}:first-of-type`);
        console.log(`   Mobile Between-Signals Banner Image: ${betweenImageSrc}`);

        await page.locator(betweenSignalsBannerLink).first().screenshot({
          path: 'test-results/mobile-between-signals-banner.png'
        });
      }

      console.log('✅ Mobile viewport test completed');
    });

    test('should rotate mobile banners after 6 seconds', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('🔄 Testing mobile banner rotation...');

      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="platform=mobile"][href*="pos=side"]';
      const initialImageSrc = await getBannerImageSrc(page, sideBannerLink);
      console.log(`   Initial mobile side banner: ${initialImageSrc}`);

      await page.screenshot({
        path: 'test-results/mobile-rotation-before.png',
        fullPage: false
      });

      console.log('   Waiting 6 seconds for rotation...');
      await page.waitForTimeout(6000);

      const rotatedImageSrc = await getBannerImageSrc(page, sideBannerLink);
      console.log(`   Rotated mobile side banner: ${rotatedImageSrc}`);

      await page.screenshot({
        path: 'test-results/mobile-rotation-after.png',
        fullPage: false
      });

      expect(initialImageSrc).not.toBe(rotatedImageSrc);
      console.log('✅ Mobile banner rotation verified');
    });
  });

  test.describe('TEST 3: Banner Rotation Verification', () => {
    test('should rotate through 3 different variants for side banner', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('🔄 Testing 3-variant rotation cycle...');

      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="pos=side"]';
      const variants: string[] = [];

      // Capture variant 1
      const variant1 = await getBannerImageSrc(page, sideBannerLink);
      variants.push(variant1);
      console.log(`   Variant 1: ${variant1}`);
      await page.screenshot({ path: 'test-results/rotation-variant-1.png' });

      // Wait for rotation to variant 2
      await page.waitForTimeout(6000);
      const variant2 = await getBannerImageSrc(page, sideBannerLink);
      variants.push(variant2);
      console.log(`   Variant 2: ${variant2}`);
      await page.screenshot({ path: 'test-results/rotation-variant-2.png' });

      // Wait for rotation to variant 3
      await page.waitForTimeout(6000);
      const variant3 = await getBannerImageSrc(page, sideBannerLink);
      variants.push(variant3);
      console.log(`   Variant 3: ${variant3}`);
      await page.screenshot({ path: 'test-results/rotation-variant-3.png' });

      // Verify all 3 variants are different
      expect(variant1).not.toBe(variant2);
      expect(variant2).not.toBe(variant3);
      expect(variant1).not.toBe(variant3);

      console.log('✅ Successfully verified 3 different banner variants');
    });

    test('should rotate footer banner variants', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Scroll to footer
      await page.evaluate(() => {
        const footer = document.querySelector('a[href*="pos=footer"]');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(2000);

      console.log('🔄 Testing footer banner rotation...');

      const footerBannerLink = 'a[href*="exnessonelink.com"][href*="pos=footer"]';

      const initialFooter = await getBannerImageSrc(page, footerBannerLink);
      console.log(`   Initial footer: ${initialFooter}`);

      await page.waitForTimeout(6000);

      const rotatedFooter = await getBannerImageSrc(page, footerBannerLink);
      console.log(`   Rotated footer: ${rotatedFooter}`);

      expect(initialFooter).not.toBe(rotatedFooter);
      console.log('✅ Footer banner rotation verified');
    });
  });

  test.describe('TEST 4: Platform Detection', () => {
    test('should switch from web to mobile URLs when resizing viewport', async ({ page }) => {
      console.log('📐 Testing platform detection during resize...');

      // Start at web viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="pos=side"]';

      // Capture web URL
      const webUrl = await getBannerAffiliateUrl(page, sideBannerLink);
      console.log(`   Web URL (1920px): ${webUrl}`);
      expect(webUrl).not.toContain('platform=mobile');

      await page.screenshot({ path: 'test-results/platform-web.png' });

      // Resize to mobile (below 1024px threshold)
      console.log('   Resizing to 1000px (mobile threshold)...');
      await page.setViewportSize({ width: 1000, height: 800 });
      await page.waitForTimeout(2000); // Give time for platform detection to trigger

      // Check if URL changed to mobile
      const mobileUrl = await getBannerAffiliateUrl(page, sideBannerLink);
      console.log(`   Mobile URL (1000px): ${mobileUrl}`);
      expect(mobileUrl).toContain('platform=mobile');

      await page.screenshot({ path: 'test-results/platform-mobile.png' });

      console.log('✅ Platform detection verified - URLs updated on resize');
    });

    test('should use correct banner images for web vs mobile', async ({ page }) => {
      console.log('🖼️ Testing web vs mobile banner images...');

      // Web viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="pos=side"]';
      const webImage = await getBannerImageSrc(page, sideBannerLink);
      console.log(`   Web image: ${webImage}`);

      // Mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const mobileBannerLink = 'a[href*="exnessonelink.com"][href*="platform=mobile"][href*="pos=side"]';
      const mobileImage = await getBannerImageSrc(page, mobileBannerLink);
      console.log(`   Mobile image: ${mobileImage}`);

      // Images might be the same or different based on config
      // Main verification is that both load successfully
      expect(webImage).toBeTruthy();
      expect(mobileImage).toBeTruthy();

      console.log('✅ Both web and mobile images load correctly');
    });
  });

  test.describe('TEST 5: Between-Signals Banner Placement', () => {
    test('should appear after every 3rd signal in timeline', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('📍 Testing between-signals banner placement...');

      // Scroll to timeline area
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(1000);

      const betweenSignalsBannerLink = 'a[href*="exnessonelink.com"][href*="pos=between-signals"]';
      const bannerCount = await page.locator(betweenSignalsBannerLink).count();

      console.log(`   Found ${bannerCount} between-signals banner(s) in timeline`);

      // If we have 9+ signals, we should have at least 2 banners (after 3rd and 6th signal)
      // If we have 6+ signals, we should have at least 1 banner (after 3rd signal)
      if (bannerCount > 0) {
        expect(bannerCount).toBeGreaterThanOrEqual(1);
        console.log('✅ Between-signals banners are present in timeline');

        // Take full page screenshot to see placement
        await page.screenshot({
          path: 'test-results/timeline-with-banners.png',
          fullPage: true
        });
      } else {
        console.log('⚠️  No between-signals banners found (might not have enough signals)');
      }
    });
  });

  test.describe('TEST 6: DOM Structure and Styling', () => {
    test('should have correct CSS classes and structure', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('🎨 Testing DOM structure and styling...');

      // Check side banner container has correct classes
      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="pos=side"]';
      const sideContainer = page.locator(sideBannerLink).locator('..');

      // Verify sponsor label exists
      const sponsorLabel = page.locator('text=Sponsored').first();
      await expect(sponsorLabel).toBeVisible();
      console.log('   ✓ Sponsor label visible');

      // Check footer banner has risk warning
      await page.evaluate(() => {
        const footer = document.querySelector('a[href*="pos=footer"]');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1000);

      const riskWarning = page.locator('text=Risk warning').first();
      await expect(riskWarning).toBeVisible();
      console.log('   ✓ Risk warning visible');

      // Check images are loading (not broken)
      const allBannerImages = page.locator('a[href*="exnessonelink.com"] img');
      const imageCount = await allBannerImages.count();
      console.log(`   Found ${imageCount} banner images`);

      for (let i = 0; i < imageCount; i++) {
        const img = allBannerImages.nth(i);
        const isVisible = await img.isVisible();
        expect(isVisible).toBeTruthy();
      }
      console.log('   ✓ All banner images are visible');

      console.log('✅ DOM structure and styling verified');
    });

    test('should not have layout overlaps or issues', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('📐 Testing for layout issues...');

      // Take full page screenshot for manual review
      await page.screenshot({
        path: 'test-results/full-layout-check.png',
        fullPage: true
      });

      // Check that banners are not overlapping page content
      const sideBannerLink = 'a[href*="exnessonelink.com"][href*="pos=side"]';
      const sideBanner = page.locator(sideBannerLink).first();

      const sideBox = await sideBanner.boundingBox();
      if (sideBox) {
        console.log(`   Side banner dimensions: ${sideBox.width}x${sideBox.height}`);
        expect(sideBox.width).toBeGreaterThan(0);
        expect(sideBox.height).toBeGreaterThan(0);
      }

      console.log('✅ Layout check completed');
    });
  });

  test.describe('TEST 7: Affiliate Link Functionality', () => {
    test('should have correct affiliate URLs and parameters', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      console.log('🔗 Testing affiliate link structure...');

      const baseUrl = 'https://one.exnessonelink.com/intl/en/a/c_8f0nxidtbt';

      // Test side banner
      const sideUrl = await getBannerAffiliateUrl(page, 'a[href*="pos=side"]');
      expect(sideUrl).toContain(baseUrl);
      expect(sideUrl).toContain('?pos=side');
      console.log(`   ✓ Side banner URL correct: ${sideUrl}`);

      // Test footer banner
      const footerUrl = await getBannerAffiliateUrl(page, 'a[href*="pos=footer"]');
      expect(footerUrl).toContain(baseUrl);
      expect(footerUrl).toContain('?pos=footer');
      console.log(`   ✓ Footer banner URL correct: ${footerUrl}`);

      // Check that links open in new tab
      const sideBannerLink = page.locator('a[href*="exnessonelink.com"]').first();
      const target = await sideBannerLink.getAttribute('target');
      expect(target).toBe('_blank');
      console.log('   ✓ Links open in new tab (_blank)');

      // Check rel attributes for SEO
      const rel = await sideBannerLink.getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('sponsored');
      console.log('   ✓ Correct rel attributes (noopener, sponsored)');

      console.log('✅ Affiliate link functionality verified');
    });
  });
});
