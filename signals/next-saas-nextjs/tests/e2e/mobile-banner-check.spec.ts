import { test, expect } from '@playwright/test';

test.describe('Mobile Banner UX Fix', () => {
  test('should NOT show vertical banners in mobile signals feed', async ({ page }) => {
    // Set mobile viewport (iPhone 12 Pro dimensions)
    await page.setViewportSize({ width: 390, height: 844 });

    // Navigate to homepage
    await page.goto('http://localhost:5001/en');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Scroll to signals section
    await page.evaluate(() => {
      const signalsSection = document.querySelector('[id="signals-feed-container"]');
      if (signalsSection) {
        signalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    await page.waitForTimeout(1000);

    // Check for vertical banners (120x600 or taller than 400px)
    const verticalBanners = await page.locator('img[src*="120x600"], img[src*="160x600"]').all();

    console.log(`🔍 Found ${verticalBanners.length} vertical banner(s) with 120x600 or 160x600 in src`);

    for (const banner of verticalBanners) {
      const isVisible = await banner.isVisible();
      const boundingBox = await banner.boundingBox();

      if (isVisible && boundingBox) {
        console.log(`⚠️  Vertical banner detected:`, {
          width: boundingBox.width,
          height: boundingBox.height,
          src: await banner.getAttribute('src'),
          visible: isVisible
        });
      }
    }

    // Check all visible images
    const allImages = await page.locator('img[src*="exness"], img[src*="cloudfront"]').all();
    console.log(`📊 Total Exness/CDN images found: ${allImages.length}`);

    for (const img of allImages) {
      const isVisible = await img.isVisible();
      if (isVisible) {
        const box = await img.boundingBox();
        const src = await img.getAttribute('src');

        if (box) {
          console.log(`📷 Image:`, {
            src: src?.substring(src.lastIndexOf('/') + 1),
            width: Math.round(box.width),
            height: Math.round(box.height),
            ratio: (box.height / box.width).toFixed(2)
          });

          // Fail test if vertical banner (aspect ratio > 1.5) is visible on mobile
          if (box.height / box.width > 1.5 && box.height > 250) {
            throw new Error(`❌ FAIL: Vertical banner detected in mobile view! ${src} (${Math.round(box.width)}x${Math.round(box.height)})`);
          }
        }
      }
    }

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'mobile-banner-check.png',
      fullPage: true
    });

    console.log('✅ PASS: No vertical banners found in mobile signals feed');
  });

  test('should have mobile-friendly modal (no sticky positioning)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    // Click the "Start Trial" button to open modal
    const startTrialButton = page.locator('text=/View Latest.*Signals Summary|Start.*Trial/i').first();
    await startTrialButton.click();

    // Wait for modal to appear
    await page.waitForSelector('text="Latest Signals Summary"', { timeout: 5000 });

    // Check for sticky positioning (should NOT exist)
    const stickyElements = await page.locator('.sticky').all();
    console.log(`🔍 Found ${stickyElements.length} elements with 'sticky' class`);

    const modalHeader = page.locator('text="Latest Signals Summary"').locator('..').locator('..');
    const headerClasses = await modalHeader.getAttribute('class');

    console.log(`📋 Modal header classes:`, headerClasses);

    // Verify NO sticky positioning
    if (headerClasses?.includes('sticky')) {
      throw new Error('❌ FAIL: Modal header still has sticky positioning!');
    }

    // Check footer
    const closeButton = page.locator('button:has-text("Close")').last();
    const footerDiv = closeButton.locator('..');
    const footerClasses = await footerDiv.getAttribute('class');

    console.log(`📋 Modal footer classes:`, footerClasses);

    if (footerClasses?.includes('sticky')) {
      throw new Error('❌ FAIL: Modal footer still has sticky positioning!');
    }

    // Take screenshot
    await page.screenshot({
      path: 'mobile-modal-check.png'
    });

    console.log('✅ PASS: Modal has no sticky positioning on mobile');
  });
});
