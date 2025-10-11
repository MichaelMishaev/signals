import { test, expect } from '@playwright/test';

test.describe('Privacy Policy - No Menu Header', () => {
  test('should not display navigation menu on privacy policy page', async ({ page }) => {
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Check that header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check that logo is visible
    const logo = header.locator('a[href*="/"]').first();
    await expect(logo).toBeVisible();

    // Check that language switcher is visible
    const languageSwitcher = page.locator('div').filter({ has: page.locator('button:has-text("English")') });
    await expect(languageSwitcher.first()).toBeVisible();

    // Check that navigation menu is NOT visible
    const nav = page.locator('nav');
    await expect(nav).not.toBeVisible();

    // Check that "Get started" button is NOT visible
    const getStartedButton = page.locator('a:has-text("Get started")');
    await expect(getStartedButton).not.toBeVisible();

    // Check that mobile menu button is NOT visible
    const mobileMenuButton = page.locator('button[aria-label*="menu"]');
    await expect(mobileMenuButton).not.toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/privacy-no-menu.png' });

    console.log('✓ Privacy policy page has no navigation menu');
    console.log('✓ Logo and language switcher are still visible');
  });

  test('should have clean header on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/privacy-policy');
    await page.waitForLoadState('networkidle');

    // Check that mobile menu button is NOT visible
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu|bars/i });
    const count = await mobileMenuButton.count();
    expect(count).toBe(0);

    // Take mobile screenshot
    await page.screenshot({ path: 'tests/screenshots/privacy-no-menu-mobile.png' });

    console.log('✓ Mobile privacy page has no menu button');
  });
});
