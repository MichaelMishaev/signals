import { test, expect } from '@playwright/test';

test.describe('Header Class Check', () => {
  test('should check header classes for lp:!max-w-[1290px]', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Find the header element (may not be visible in production mode)
    const header = page.locator('header');

    // Get the div inside header with the className
    const headerDiv = header.locator('div').first();

    // Get the class attribute
    const classAttribute = await headerDiv.getAttribute('class');
    console.log('Header div classes:', classAttribute);

    // Check if it contains lp: or 1290
    if (classAttribute?.includes('lp:') || classAttribute?.includes('1290')) {
      console.error('❌ Found lp: or 1290 in classes!');
      console.error('Full class string:', classAttribute);
      throw new Error('Found lp: or 1290 in header classes');
    } else {
      console.log('✓ No lp: or 1290 found in classes');
    }

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/header-check.png', fullPage: true });
  });
});
