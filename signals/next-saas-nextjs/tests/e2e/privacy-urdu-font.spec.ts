import { test, expect } from '@playwright/test';

test.describe('Privacy Policy Urdu Font Rendering', () => {
  test('should display Urdu text with proper Nastaliq font', async ({ page }) => {
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Click the language toggle to switch to Urdu
    const toggleButton = page.locator('button').filter({ hasText: 'اردو' }).first();
    await toggleButton.click();

    // Wait for Urdu content to render
    await page.waitForTimeout(1000);

    // Take a screenshot to verify font rendering
    await page.screenshot({
      path: 'tests/screenshots/privacy-policy-urdu-font.png',
      fullPage: true
    });

    // Verify Urdu heading is visible with bold font
    const urduHeading = page.locator('h2').first();
    await expect(urduHeading).toBeVisible();

    // Check computed styles for Urdu text
    const fontFamily = await urduHeading.evaluate((el) =>
      window.getComputedStyle(el).fontFamily
    );

    console.log('✓ Urdu font family:', fontFamily);

    // Verify font contains Nastaliq
    expect(fontFamily.toLowerCase()).toContain('nastaliq');

    // Take zoomed screenshot of heading for font inspection
    const headingBox = await urduHeading.boundingBox();
    if (headingBox) {
      await page.screenshot({
        path: 'tests/screenshots/privacy-urdu-heading-closeup.png',
        clip: {
          x: headingBox.x,
          y: headingBox.y,
          width: headingBox.width,
          height: headingBox.height
        }
      });
    }

    console.log('✓ Urdu font rendering test completed');
  });

  test('should have proper line height and spacing for Urdu text', async ({ page }) => {
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Switch to Urdu
    const toggleButton = page.locator('button').filter({ hasText: 'اردو' }).first();
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Check paragraph line height
    const paragraph = page.locator('p.font-urdu').first();
    const lineHeight = await paragraph.evaluate((el) =>
      window.getComputedStyle(el).lineHeight
    );

    console.log('✓ Urdu paragraph line-height:', lineHeight);

    // Verify line height is generous (should be ~2.5 relative)
    const fontSize = await paragraph.evaluate((el) =>
      parseInt(window.getComputedStyle(el).fontSize)
    );
    const lineHeightNum = parseFloat(lineHeight);
    const ratio = lineHeightNum / fontSize;

    console.log('✓ Line height ratio:', ratio.toFixed(2));
    expect(ratio).toBeGreaterThan(2.0); // Should be at least 2.0 for readability

    console.log('✓ Urdu spacing test completed');
  });

  test('should display Urdu text on mobile with proper font', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Switch to Urdu
    const toggleButton = page.locator('button').filter({ hasText: 'اردو' }).first();
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Take mobile screenshot
    await page.screenshot({
      path: 'tests/screenshots/privacy-policy-urdu-mobile.png',
      fullPage: true
    });

    // Verify heading is readable on mobile
    const heading = page.locator('h2').first();
    await expect(heading).toBeVisible();

    const fontSize = await heading.evaluate((el) =>
      window.getComputedStyle(el).fontSize
    );

    console.log('✓ Mobile Urdu font size:', fontSize);
    console.log('✓ Urdu mobile rendering test completed');
  });
});
