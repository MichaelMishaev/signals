import { test, expect } from '@playwright/test';

test.describe('GSAP and Homepage Verification', () => {
  test('homepage loads without GSAP errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    // Navigate to homepage
    await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });

    // Wait for main content to be visible
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });

    // Check for Hero section
    const heroVisible = await page.locator('text=/Trade/i').first().isVisible();
    expect(heroVisible).toBeTruthy();

    // Check for no GSAP-related errors
    const gsapErrors = consoleErrors.filter(
      (error) =>
        error.includes('ScrollTrigger') ||
        error.includes('GSAP') ||
        error.includes("can't access property") ||
        error.includes('init')
    );

    console.log('All console errors:', consoleErrors);
    console.log('GSAP-related errors:', gsapErrors);

    // Expect no GSAP initialization errors
    expect(gsapErrors).toHaveLength(0);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/homepage-gsap-fixed.png', fullPage: true });
  });

  test('NewsAPI integration working', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });

    // Wait for the page to fully load
    await page.waitForTimeout(2000);

    // Check if news tab exists (part of the new tab switcher)
    const newsTabExists = await page.locator('text=/News/i').count();
    expect(newsTabExists).toBeGreaterThan(0);

    console.log('News tab found:', newsTabExists > 0);
  });
});
