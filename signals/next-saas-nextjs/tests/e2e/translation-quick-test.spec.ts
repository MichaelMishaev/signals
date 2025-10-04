import { test, expect } from '@playwright/test';

test.describe('Translation System Quick Test', () => {
  test('English page loads with correct content', async ({ page }) => {
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    // Check English Hero content
    await expect(page.locator('text=Professional Trading Signals')).toBeVisible();
    await expect(page.locator('text=for Pakistani Markets')).toBeVisible();

    console.log('✅ English page loads correctly');
  });

  test('Urdu page loads with RTL layout', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Check Urdu content
    await expect(page.locator('text=پیشہ ورانہ تجارتی سگنل')).toBeVisible();

    // Check RTL direction
    const html = await page.locator('html');
    const dir = await html.getAttribute('dir');
    expect(dir).toBe('rtl');

    console.log('✅ Urdu page loads with RTL');
  });

  test('Root redirects to /en', async ({ page }) => {
    await page.goto('http://localhost:5001/');
    await page.waitForLoadState('networkidle');

    // Should be redirected to /en
    expect(page.url()).toContain('/en');

    console.log('✅ Root redirects to /en');
  });
});
