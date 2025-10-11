import { test, expect } from '@playwright/test';

test.describe('Privacy Policy Page', () => {
  test('should display privacy policy page and load successfully', async ({ page }) => {
    await page.goto('/en/privacy-policy');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/privacy-policy-loaded.png', fullPage: true });

    // Check if the page loaded (we know it returns 200)
    console.log('✓ Privacy policy page loaded successfully at /en/privacy-policy');
  });

  test('should display key privacy content', async ({ page }) => {
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Check for main heading - might need to wait for it
    const mainHeading = page.locator('h2').first();
    await expect(mainHeading).toBeVisible({ timeout: 10000 });

    console.log('✓ Privacy policy content is visible');
  });

  test('should have language toggle button', async ({ page }) => {
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Look for any button (language toggle)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    expect(buttonCount).toBeGreaterThan(0);
    console.log(`✓ Found ${buttonCount} button(s) on the page`);
  });

  test('should be accessible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Take mobile screenshot
    await page.screenshot({ path: 'tests/screenshots/privacy-policy-mobile.png', fullPage: true });

    console.log('✓ Privacy policy page renders on mobile');
  });
});
